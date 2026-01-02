'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import ExpenseForm from './components/ExpenseForm/ExpenseForm';
import ExpenseList from './components/ExpenseList/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary/ExpenseSummary';
import MonthlyAnalysis from './components/MonthlyAnalysis/MonthlyAnalysis';
import styles from './page.module.css';
import { FaPlus, FaChartBar, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <ExpenseProvider>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <FaChartBar className={styles.headerIcon} />
              <h1>Expense Tracker</h1>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.userInfo}>
                <FaUser />
                <span>{user?.name}</span>
              </div>
              <button
                className={styles.addButton}
                onClick={() => setShowForm(!showForm)}
              >
                <FaPlus /> {showForm ? 'Cancel' : 'Add Expense'}
              </button>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                title="Logout"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {showForm && (
            <ExpenseForm
              onSubmit={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          )}

          <ExpenseSummary />

          <MonthlyAnalysis />

          <ExpenseList />
        </main>
      </div>
    </ExpenseProvider>
  );
}
