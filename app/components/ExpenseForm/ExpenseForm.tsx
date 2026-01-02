'use client';

import { useState, useEffect } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Expense } from '../../types/expense';
import styles from './ExpenseForm.module.css';
import { FaPlus, FaTimes } from 'react-icons/fa';

interface ExpenseFormProps {
  expense?: Expense;
  onCancel?: () => void;
  onSubmit?: () => void;
}

export default function ExpenseForm({ expense, onCancel, onSubmit }: ExpenseFormProps) {
  const { addExpense, updateExpense, categories } = useExpense();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: categories[0]?.name || '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
      });
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    const expenseData = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      description: formData.description.trim(),
    };

    let success = false;
    if (expense) {
      success = await updateExpense(expense.id, expenseData);
    } else {
      success = await addExpense(expenseData);
    }

    if (success) {
      // Reset form
      setFormData({
        title: '',
        amount: '',
        category: categories[0]?.name || '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });

      onSubmit?.();
    } else {
      alert('Failed to save expense. Please try again.');
    }
  };

  const handleCancel = () => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
        description: expense.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: categories[0]?.name || '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    onCancel?.();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            type="text"
            className={styles.input}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter expense title"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="amount">
            Amount *
          </label>
          <input
            id="amount"
            type="number"
            className={styles.input}
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="category">
            Category *
          </label>
          <select
            id="category"
            className={styles.select}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="date">
            Date *
          </label>
          <input
            id="date"
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label className={styles.label} htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter expense description (optional)"
          />
        </div>
      </div>

      <div className={styles.buttonGroup}>
        {onCancel && (
          <button
            type="button"
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleCancel}
          >
            <FaTimes /> Cancel
          </button>
        )}
        <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
          <FaPlus /> {expense ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
}

