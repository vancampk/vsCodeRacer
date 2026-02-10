<template>
  <div class="stats-panel">
    <div class="stats-content">
      <!-- Summary Cards -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-card-icon">
            <v-icon size="32" color="info">mdi-speedometer</v-icon>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">Average WPM</div>
            <div class="stat-card-value">{{ statsStore.averageWPM }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon">
            <v-icon size="32" color="success">mdi-target</v-icon>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">Average Accuracy</div>
            <div class="stat-card-value">{{ statsStore.averageAccuracy }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon">
            <v-icon size="32" color="warning">mdi-counter</v-icon>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">Total Sessions</div>
            <div class="stat-card-value">{{ statsStore.totalSessionsPlayed }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-card-icon">
            <v-icon size="32" color="primary">mdi-format-list-numbered</v-icon>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">Lifetime Lines</div>
            <div class="stat-card-value">{{ statsStore.lifetimeLinesCompleted }}</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- WPM Over Time -->
        <div class="chart-container">
          <h3>WPM Over Last 10 Sessions</h3>
          <Line :data="wpmChartData" :options="chartOptions" />
        </div>

        <!-- Accuracy Over Time -->
        <div class="chart-container">
          <h3>Accuracy Over Last 10 Sessions</h3>
          <Line :data="accuracyChartData" :options="chartOptions" />
        </div>

        <!-- LOC/min Over Time -->
        <div class="chart-container">
          <h3>LOC/min Over Last 10 Sessions</h3>
          <Line :data="locChartData" :options="chartOptions" />
        </div>

        <!-- Best Scores Bar Chart -->
        <div class="chart-container">
          <h3>Personal Best Scores</h3>
          <Bar :data="bestScoresChartData" :options="barChartOptions" />
        </div>
      </div>

      <!-- Detailed Stats Table -->
      <div class="stats-table-container">
        <h3>Recent Sessions History</h3>
        <div class="stats-table">
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Date</th>
                <th>WPM</th>
                <th>Accuracy</th>
                <th>LOC/min</th>
                <th>Lines</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(session, index) in statsStore.sessionHistory" :key="index">
                <td>#{{ statsStore.totalSessionsPlayed - index }}</td>
                <td>{{ formatDate(session.timestamp) }}</td>
                <td>{{ session.wpm }}</td>
                <td>{{ session.accuracy }}%</td>
                <td>{{ session.locPerMinute }}</td>
                <td>{{ session.linesCompleted }}</td>
                <td>{{ formatTime(session.timeElapsed) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="statsStore.sessionHistory.length === 0" class="no-data">
            No session data available. Start playing to see your stats!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStatsStore } from '../stores/statsStore'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

defineEmits(['close'])

const statsStore = useStatsStore()

// WPM Chart Data
const wpmChartData = computed(() => {
  const sessions = [...statsStore.sessionHistory].reverse()
  return {
    labels: sessions.map((_, i) => `Session ${i + 1}`),
    datasets: [
      {
        label: 'WPM',
        data: sessions.map(s => s.wpm),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Accuracy Chart Data
const accuracyChartData = computed(() => {
  const sessions = [...statsStore.sessionHistory].reverse()
  return {
    labels: sessions.map((_, i) => `Session ${i + 1}`),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: sessions.map(s => s.accuracy),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// LOC/min Chart Data
const locChartData = computed(() => {
  const sessions = [...statsStore.sessionHistory].reverse()
  return {
    labels: sessions.map((_, i) => `Session ${i + 1}`),
    datasets: [
      {
        label: 'LOC/min',
        data: sessions.map(s => s.locPerMinute),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  }
})

// Best Scores Chart Data
const bestScoresChartData = computed(() => ({
  labels: ['Best WPM', 'Best Accuracy', 'Best LOC/min'],
  datasets: [
    {
      label: 'Personal Best',
      data: [
        statsStore.bestWPM,
        statsStore.bestAccuracy,
        statsStore.bestLOCPerMinute
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderColor: [
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(255, 159, 64)'
      ],
      borderWidth: 2
    }
  ]
}))

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff'
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff'
      }
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#fff'
      }
    }
  }
}

// Helper Functions
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.stats-panel {
  flex: 1;
  min-height: 0;
  background: var(--editor-background);
  color: var(--text-color);
  overflow-y: auto;
}

.stats-content {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-card-icon {
  flex-shrink: 0;
}

.stat-card-content {
  flex: 1;
}

.stat-card-label {
  font-size: 12px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-card-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-container > div {
  flex: 1;
  min-height: 0;
}

.chart-container h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.stats-table-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
}

.stats-table-container h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.stats-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(255, 255, 255, 0.05);
}

th {
  padding: 12px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid var(--border-color);
}

td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.no-data {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-style: italic;
}

/* Scrollbar Styling */
.stats-panel::-webkit-scrollbar {
  width: 12px;
}

.stats-panel::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.stats-panel::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.stats-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
