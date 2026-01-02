'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseCategory } from '../types/expense';
import { useAuth } from './AuthContext';

interface ExpenseContextType {
  expenses: Expense[];
  categories: ExpenseCategory[];
  loading: boolean;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<boolean>;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: () => number;
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
  fetchExpenses: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food', icon: 'FaUtensils', color: '#ef4444' },
  { id: '2', name: 'Transport', icon: 'FaCar', color: '#3b82f6' },
  { id: '3', name: 'Shopping', icon: 'FaShoppingBag', color: '#8b5cf6' },
  { id: '4', name: 'Bills', icon: 'FaFileInvoice', color: '#f59e0b' },
  { id: '5', name: 'Entertainment', icon: 'FaFilm', color: '#10b981' },
  { id: '6', name: 'Health', icon: 'FaHeartbeat', color: '#ec4899' },
  { id: '7', name: 'Education', icon: 'FaGraduationCap', color: '#6366f1' },
  { id: '8', name: 'Other', icon: 'FaEllipsisH', color: '#6b7280' },
];

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<ExpenseCategory[]>(defaultCategories);
  const [loading, setLoading] = useState(false);

  // Fetch expenses from API when user changes
  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/expenses', {
        headers: {
          'x-user-id': user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      } else {
        console.error('Failed to fetch expenses');
        setExpenses([]);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addExpense = async (expense: Omit<Expense, 'id'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses((prev) => [...prev, data.expense]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding expense:', error);
      return false;
    }
  };

  const updateExpense = async (id: string, expense: Omit<Expense, 'id'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses((prev) =>
          prev.map((exp) => (exp.id === id ? data.expense : exp))
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating expense:', error);
      return false;
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      });

      if (response.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
  };

  const getExpensesByCategory = (category: string): Expense[] => {
    return expenses.filter((exp) => exp.category === category);
  };

  const getTotalExpenses = (): number => {
    return expenses.reduce((total, exp) => total + exp.amount, 0);
  };

  const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
    return expenses.filter(
      (exp) => exp.date >= startDate && exp.date <= endDate
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        loading,
        addExpense,
        updateExpense,
        deleteExpense,
        getExpensesByCategory,
        getTotalExpenses,
        getExpensesByDateRange,
        fetchExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}

