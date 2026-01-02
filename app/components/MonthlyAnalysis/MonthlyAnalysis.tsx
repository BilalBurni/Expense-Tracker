'use client';

import { useState, useMemo } from 'react';
import { useExpense } from '../../context/ExpenseContext';
import { iconMap } from '../../utils/iconMap';
import styles from './MonthlyAnalysis.module.css';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';

interface MonthlyData {
  month: string;
  year: number;
  monthIndex: number;
  total: number;
  count: number;
  expenses: any[];
  categoryBreakdown: {
    category: string;
    total: number;
    count: number;
    color: string;
    icon: string;
  }[];
}

export default function MonthlyAnalysis() {
  const { expenses, categories, getExpensesByCategory } = useExpense();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Group expenses by month
  const monthlyData = useMemo(() => {
    const grouped: Record<string, MonthlyData> = {};

    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          month: monthName,
          year: date.getFullYear(),
          monthIndex: date.getMonth(),
          total: 0,
          count: 0,
          expenses: [],
          categoryBreakdown: [],
        };
      }

      grouped[monthKey].total += expense.amount;
      grouped[monthKey].count += 1;
      grouped[monthKey].expenses.push(expense);
    });

    // Calculate category breakdown for each month
    Object.values(grouped).forEach((monthData) => {
      const categoryMap: Record<string, { total: number; count: number; color: string; icon: string }> = {};

      monthData.expenses.forEach((exp) => {
        const categoryInfo = categories.find((cat) => cat.name === exp.category) || categories[categories.length - 1];
        
        if (!categoryMap[exp.category]) {
          categoryMap[exp.category] = {
            total: 0,
            count: 0,
            color: categoryInfo.color,
            icon: categoryInfo.icon,
          };
        }
        categoryMap[exp.category].total += exp.amount;
        categoryMap[exp.category].count += 1;
      });

      monthData.categoryBreakdown = Object.entries(categoryMap)
        .map(([category, data]) => ({
          category,
          ...data,
        }))
        .sort((a, b) => b.total - a.total);
    });

    return Object.values(grouped).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.monthIndex - a.monthIndex;
    });
  }, [expenses, categories]);

  // Get available months for selector
  const availableMonths = useMemo(() => {
    return monthlyData.map((data) => {
      const date = new Date(data.year, data.monthIndex);
      return {
        key: `${data.year}-${String(data.monthIndex + 1).padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        fullLabel: data.month,
      };
    });
  }, [monthlyData]);

  // Filter data based on selected month
  const displayedData = selectedMonth === 'all' 
    ? monthlyData 
    : monthlyData.filter((data) => {
        const key = `${data.year}-${String(data.monthIndex + 1).padStart(2, '0')}`;
        return key === selectedMonth;
      });

  // Calculate statistics
  const stats = useMemo(() => {
    if (monthlyData.length === 0) {
      return {
        averageMonthly: 0,
        highestMonth: null as MonthlyData | null,
        lowestMonth: null as MonthlyData | null,
        totalMonths: 0,
      };
    }

    const totals = monthlyData.map((m) => m.total);
    const averageMonthly = totals.reduce((sum, total) => sum + total, 0) / monthlyData.length;
    const highestMonth = monthlyData.reduce((max, month) => 
      month.total > max.total ? month : max
    );
    const lowestMonth = monthlyData.reduce((min, month) => 
      month.total < min.total ? month : min
    );

    return {
      averageMonthly,
      highestMonth,
      lowestMonth,
      totalMonths: monthlyData.length,
    };
  }, [monthlyData]);

  // Get max value for bar chart scaling
  const maxValue = useMemo(() => {
    if (monthlyData.length === 0) return 1;
    return Math.max(...monthlyData.map((m) => m.total));
  }, [monthlyData]);

  if (monthlyData.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>
          <FaChartLine /> Monthly Analysis
        </h2>
        <div className={styles.emptyState}>
          <FaCalendarAlt className={styles.emptyStateIcon} />
          <p>No expense data available for monthly analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FaChartLine /> Monthly Analysis
      </h2>

      {/* Month Selector */}
      <div className={styles.monthSelector}>
        <button
          className={`${styles.monthButton} ${selectedMonth === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedMonth('all')}
        >
          All Months
        </button>
        {availableMonths.map((month) => (
          <button
            key={month.key}
            className={`${styles.monthButton} ${selectedMonth === month.key ? styles.active : ''}`}
            onClick={() => setSelectedMonth(month.key)}
          >
            {month.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {selectedMonth === 'all' && (
        <div className={styles.monthStats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Average Monthly</div>
            <div className={`${styles.statValue} ${styles.negative}`}>
              ₨{stats.averageMonthly.toFixed(2)}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Highest Month</div>
            <div className={`${styles.statValue} ${styles.negative}`}>
              {stats.highestMonth ? `₨${stats.highestMonth.total.toFixed(2)}` : 'N/A'}
            </div>
            {stats.highestMonth && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {stats.highestMonth.month}
              </div>
            )}
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Lowest Month</div>
            <div className={`${styles.statValue} ${styles.negative}`}>
              {stats.lowestMonth ? `₨${stats.lowestMonth.total.toFixed(2)}` : 'N/A'}
            </div>
            {stats.lowestMonth && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {stats.lowestMonth.month}
              </div>
            )}
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Months</div>
            <div className={styles.statValue}>{stats.totalMonths}</div>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      {selectedMonth === 'all' && monthlyData.length > 0 && (
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>Monthly Spending Trend</h3>
          <div className={styles.barChart}>
            {monthlyData.map((monthData) => {
              const percentage = (monthData.total / maxValue) * 100;
              return (
                <div key={`${monthData.year}-${monthData.monthIndex}`} className={styles.barItem}>
                  <div className={styles.barLabel}>
                    {new Date(monthData.year, monthData.monthIndex).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 10 && `₨${monthData.total.toFixed(0)}`}
                    </div>
                  </div>
                  <div className={styles.barAmount}>
                    ₨{monthData.total.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      <div className={styles.monthlyList}>
        {displayedData.map((monthData) => {
          const monthKey = `${monthData.year}-${String(monthData.monthIndex + 1).padStart(2, '0')}`;
          return (
            <div key={monthKey} className={styles.monthSection}>
              <div className={styles.monthHeader}>
                <div className={styles.monthName}>{monthData.month}</div>
                <div className={styles.monthTotal}>
                  ₨{monthData.total.toFixed(2)} ({monthData.count} transactions)
                </div>
              </div>

              {monthData.categoryBreakdown.length > 0 && (
                <div className={styles.monthCategories}>
                  {monthData.categoryBreakdown.map((cat) => {
                    const IconComponent = iconMap[cat.icon] || iconMap.FaEllipsisH;
                    return (
                      <div key={cat.category} className={styles.categoryItem}>
                        <div
                          className={styles.categoryIcon}
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComponent />
                        </div>
                        <div className={styles.categoryInfo}>
                          {cat.category} ({cat.count})
                        </div>
                        <div className={styles.categoryAmount}>
                          ₨{cat.total.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

