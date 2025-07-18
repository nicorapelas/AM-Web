import React, { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../common/header/Header'
import { Context as StoresContext } from '../../../context/StoresContext'
import { Context as GamesContext } from '../../../context/GamesContext'
import { Context as FinancialsContext } from '../../../context/FinancialsContext'
import { Context as AuthContext } from '../../../context/AuthContext'
import LoadingSpinner from '../../common/loaders/loadingSpinner/LoadingSpinner'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import './dashboard.css'

import ReRoutes from '../../common/functions/ReRoutes'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

const Dashboard = () => {
  const {
    state: { loading, userStores },
  } = useContext(StoresContext)

  const {
    state: { userGames },
  } = useContext(GamesContext)

  const {
    state: { userFinancials },
  } = useContext(FinancialsContext)

  const {
    state: { user },
  } = useContext(AuthContext)

  const navigate = useNavigate()

  // Calculate total daily revenue across all stores
  const totalDailyRevenue = useMemo(() => {
    if (!Array.isArray(userFinancials)) return 0
    return userFinancials
      .filter(
        (f) => new Date(f.date).toDateString() === new Date().toDateString(),
      )
      .reduce((sum, f) => sum + f.dailyProfit, 0)
  }, [userFinancials])

  // Calculate total maintenance expenses
  const maintenanceExpenses = useMemo(() => {
    if (!Array.isArray(userFinancials)) return 0
    return userFinancials.reduce((sum, f) => {
      const maintenanceExpenses = f.expenses
        .filter((e) => e.category === 'Maintenance')
        .reduce((expSum, exp) => expSum + exp.amount, 0)
      return sum + maintenanceExpenses
    }, 0)
  }, [userFinancials])

  // Prepare data for revenue trend chart
  const revenueTrendData = useMemo(() => {
    if (!Array.isArray(userFinancials)) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Daily Revenue',
            data: [],
            borderColor: '#bf0d3e',
            backgroundColor: 'rgba(191, 13, 62, 0.1)',
            tension: 0.4,
          },
        ],
      }
    }

    // Find the most recent date in userFinancials
    const mostRecentDate =
      userFinancials.length > 0
        ? new Date(Math.max(...userFinancials.map((f) => new Date(f.date))))
        : new Date()

    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date(mostRecentDate)
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      })
      .reverse()

    const revenueByDate = last7Days.map((date) => {
      const dayRevenue = userFinancials
        .filter((f) => f.date.split('T')[0] === date)
        .reduce((sum, f) => sum + f.dailyProfit, 0)
      return dayRevenue
    })

    const formattedLabels = last7Days.map((date) =>
      new Date(date).toLocaleDateString(),
    )

    const data = {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Daily Revenue',
          data: revenueByDate,
          borderColor: '#bf0d3e',
          backgroundColor: 'rgba(191, 13, 62, 0.1)',
          tension: 0.4,
        },
      ],
    }

    return data
  }, [userFinancials])

  // Prepare data for game performance chart
  const gamePerformanceData = useMemo(() => {
    if (!Array.isArray(userFinancials)) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Game Revenue',
            data: [],
            backgroundColor: [
              '#bf0d3e',
              '#041e42',
              '#4CAF50',
              '#FFC107',
              '#2196F3',
              '#9C27B0',
              '#FF5722',
            ],
          },
        ],
      }
    }

    const gameTotals = userFinancials.reduce((acc, financial) => {
      financial.gameFinances.forEach((game) => {
        if (!acc[game.gameName]) {
          acc[game.gameName] = 0
        }
        acc[game.gameName] += game.sum
      })
      return acc
    }, {})

    return {
      labels: Object.keys(gameTotals),
      datasets: [
        {
          label: 'Game Revenue',
          data: Object.values(gameTotals),
          backgroundColor: [
            '#bf0d3e',
            '#041e42',
            '#4CAF50',
            '#FFC107',
            '#2196F3',
            '#9C27B0',
            '#FF5722',
          ],
        },
      ],
    }
  }, [userFinancials])

  // Prepare data for store performance chart
  const storePerformanceData = useMemo(() => {
    if (!Array.isArray(userFinancials)) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Store Revenue',
            data: [],
            backgroundColor: ['#bf0d3e', '#041e42'],
          },
        ],
      }
    }

    const storeTotals = userFinancials.reduce((acc, financial) => {
      const store = userStores.find((s) => s._id === financial.storeId)
      if (store) {
        if (!acc[store.storeName]) {
          acc[store.storeName] = 0
        }
        acc[store.storeName] += financial.dailyProfit
      }
      return acc
    }, {})

    return {
      labels: Object.keys(storeTotals),
      datasets: [
        {
          label: 'Store Revenue',
          data: Object.values(storeTotals),
          backgroundColor: ['#bf0d3e', '#041e42'],
        },
      ],
    }
  }, [userFinancials, userStores])

  // Calculate best performing game
  const bestPerformingGame = useMemo(() => {
    if (!Array.isArray(userFinancials)) return null

    const gameTotals = userFinancials.reduce((acc, financial) => {
      financial.gameFinances.forEach((game) => {
        if (!acc[game.gameName]) {
          acc[game.gameName] = {
            total: 0,
            count: 0,
          }
        }
        acc[game.gameName].total += game.sum
        acc[game.gameName].count += 1
      })
      return acc
    }, {})

    const gameAverages = Object.entries(gameTotals).map(([name, data]) => ({
      name,
      average: data.total / data.count,
    }))

    return gameAverages.sort((a, b) => b.average - a.average)[0]
  }, [userFinancials])

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    if (!Array.isArray(userFinancials)) return 0
    return userFinancials.reduce((sum, f) => sum + f.dailyProfit, 0)
  }, [userFinancials])

  // Calculate average daily revenue
  const averageDailyRevenue = useMemo(() => {
    if (!Array.isArray(userFinancials)) return 0
    const uniqueDates = new Set(userFinancials.map((f) => f.date.split('T')[0]))
    return totalRevenue / uniqueDates.size
  }, [userFinancials, totalRevenue])

  // Prepare data for best performing game chart
  const bestGameData = useMemo(() => {
    if (!Array.isArray(userFinancials) || !bestPerformingGame) return null

    const gameData = userFinancials
      .filter((f) =>
        f.gameFinances.some((g) => g.gameName === bestPerformingGame.name),
      )
      .map((f) => {
        const gameFinance = f.gameFinances.find(
          (g) => g.gameName === bestPerformingGame.name,
        )
        return {
          date: f.date,
          revenue: gameFinance ? gameFinance.sum : 0,
        }
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))

    return {
      labels: gameData.map((d) => new Date(d.date).toLocaleDateString()),
      datasets: [
        {
          label: `${bestPerformingGame.name} Daily Revenue`,
          data: gameData.map((d) => d.revenue),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
        },
      ],
    }
  }, [userFinancials, bestPerformingGame])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const handleTotalStoresClick = () => {
    if (userStores.length === 0) {
      navigate('/add-store')
    } else {
      navigate('/stores')
    }
  }

  return (
    <div className="dashboard-container">
      <ReRoutes />
      <div className="stars-background"></div>
      <Header />

      <div className="dashboard-grid">
        {/* Summary Cards */}
        <div className="summary-cards">
          <div
            className="dashboard-card clickable"
            onClick={handleTotalStoresClick}
          >
            <div className="card-star"></div>
            <h2 className="card-title">Total Stores</h2>
            <p className="stat">{userStores.length}</p>
            {userStores.length === 0 && (
              <p className="start-here-message-dashboard">Start here!</p>
            )}
          </div>

          <div className="dashboard-card">
            <div className="card-star"></div>
            <h2 className="card-title">Total Revenue</h2>
            <p className="stat">${totalRevenue.toLocaleString()}</p>
          </div>

          <div className="dashboard-card">
            <div className="card-star"></div>
            <h2 className="card-title">Avg Daily Revenue</h2>
            <p className="stat">
              $
              {!averageDailyRevenue
                ? '0'
                : averageDailyRevenue.toLocaleString()}
            </p>
          </div>

          <div className="dashboard-card">
            <div className="card-star"></div>
            <h2 className="card-title">Best Game</h2>
            <p className="stat">{bestPerformingGame?.name || 'N/A'}</p>
            <p className="stat" style={{ fontSize: '0.8rem' }}>
              ${bestPerformingGame?.average.toLocaleString() || 0}/day
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3>Revenue Trend (Last 7 Days)</h3>
            <Line
              data={revenueTrendData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="chart-container">
            <h3>Game Performance</h3>
            <Doughnut
              data={gamePerformanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }}
            />
          </div>

          <div className="chart-container">
            <h3>Store Performance</h3>
            <Bar
              data={storePerformanceData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="chart-container">
            <h3>Best Game Performance</h3>
            {bestGameData ? (
              <Line
                data={bestGameData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `$${value}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <p style={{ textAlign: 'center', color: '#666' }}>
                No data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
