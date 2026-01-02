'use client';

import { useState } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { Expense } from '../../types/expense';
import { iconMap } from '../../utils/iconMap';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import styles from './ExpenseList.module.css';
import { FaEdit, FaTrash, FaInbox } from 'react-icons/fa';

export default function ExpenseList() {
  const { expenses, categories, deleteExpense } = useExpense();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const getCategoryInfo = (categoryName: string) => {
    return categories.find((cat) => cat.name === categoryName) || categories[categories.length - 1];
  };

  const filteredExpenses = filterCategory === 'all'
    ? expenses
    : expenses.filter((exp) => exp.category === filterCategory);

  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const success = await deleteExpense(id);
      if (!success) {
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleFormSubmit = () => {
    setEditingExpense(null);
  };

  const handleFormCancel = () => {
    setEditingExpense(null);
  };

  if (editingExpense) {
    return (
      <ExpenseForm
        expense={editingExpense}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <label htmlFor="filter" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Filter by category:
        </label>
        <select
          id="filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className={styles.emptyState}>
          <FaInbox className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>
            {filterCategory === 'all' 
              ? 'No expenses yet. Add your first expense to get started!'
              : `No expenses in ${filterCategory} category.`}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
          {sortedExpenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category);
            const IconComponent = iconMap[categoryInfo.icon] || iconMap.FaEllipsisH;

            return (
              <div key={expense.id} className={styles.expenseItem}>
                <div
                  className={styles.expenseIcon}
                  style={{ backgroundColor: categoryInfo.color }}
                >
                  <IconComponent />
                </div>
                <div className={styles.expenseContent}>
                  <div className={styles.expenseTitle}>{expense.title}</div>
                  <div className={styles.expenseMeta}>
                    <span>{expense.category}</span>
                    <span>•</span>
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                    {expense.description && (
                      <>
                        <span>•</span>
                        <span>{expense.description}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className={styles.expenseAmount}>
                  ₨{expense.amount.toFixed(2)}
                </div>
                <div className={styles.expenseActions}>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={() => handleEdit(expense)}
                    aria-label="Edit expense"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDelete(expense.id)}
                    aria-label="Delete expense"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

