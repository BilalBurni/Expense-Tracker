'use client';

import { useExpense } from '../../context/ExpenseContext';
import { iconMap } from '../../utils/iconMap';
import styles from './ExpenseSummary.module.css';

export default function ExpenseSummary() {
  const { expenses, categories, getExpensesByCategory, getTotalExpenses } = useExpense();

  const totalExpenses = getTotalExpenses();
  const expenseCount = expenses.length;
  
  // Calculate expenses for this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const thisMonthExpenses = expenses.filter(
    (exp) => exp.date >= firstDayOfMonth.toISOString().split('T')[0] &&
              exp.date <= lastDayOfMonth.toISOString().split('T')[0]
  );
  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate average expense
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  // Calculate expenses by category
  const categoryTotals = categories.map((category) => {
    const categoryExpenses = getExpensesByCategory(category.name);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length,
    };
  }).filter((cat) => cat.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Expense Summary</h2>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Expenses</div>
          <div className={`${styles.statValue} ${styles.negative}`}>
            ₨{totalExpenses.toFixed(2)}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>This Month</div>
          <div className={`${styles.statValue} ${styles.negative}`}>
            ₨{thisMonthTotal.toFixed(2)}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Transactions</div>
          <div className={styles.statValue}>{expenseCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Average Expense</div>
          <div className={styles.statValue}>
            ₨{averageExpense.toFixed(2)}
          </div>
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div className={styles.categoriesSection}>
          <h3 className={styles.sectionTitle}>Expenses by Category</h3>
          <div className={styles.categoryList}>
            {categoryTotals.map((category) => {
              const IconComponent = iconMap[category.icon] || iconMap.FaEllipsisH;
              return (
                <div key={category.id} className={styles.categoryItem}>
                  <div className={styles.categoryInfo}>
                    <div
                      className={styles.categoryIcon}
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent />
                    </div>
                    <span className={styles.categoryName}>
                      {category.name} ({category.count})
                    </span>
                  </div>
                  <span className={styles.categoryAmount}>
                    ₨{category.total.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

