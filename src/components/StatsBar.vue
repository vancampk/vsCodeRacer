<template>
  <div class="vscode-statusbar">
    <div class="stats-left">
      <div class="stat-item">
        <v-icon size="14">mdi-code-tags</v-icon>
        <span>{{ locPerMinute }} LOC/min</span>
      </div>
      <div class="stat-item">
        <v-icon size="14" :color="accuracy >= 95 ? 'success' : accuracy >= 80 ? 'warning' : 'error'">mdi-target</v-icon>
        <span>{{ accuracy }}%</span>
      </div>
      <div class="stat-item" v-if="gameMode === 'sprint'">
        <v-icon size="14">mdi-lightning-bolt</v-icon>
        <span>{{ wordsCompleted }}/10</span>
      </div>
      <div class="stat-item" v-if="gameMode !== 'sprint'">
        <v-icon size="14">mdi-timer</v-icon>
        <span>{{ formatTime(timeElapsed) }}</span>
        <span v-if="gameState === 'paused'" class="pause-indicator">
          <v-icon size="14" color="warning">mdi-pause-circle</v-icon>
          PAUSED
        </span>
      </div>
      <div class="stat-item" v-if="totalSessions > 0" title="Rolling average from last 10 sessions">
        <v-icon size="14" color="info">mdi-chart-line</v-icon>
        <span>Avg: {{ avgWPM }} WPM</span>
      </div>
    </div>
    
    <div class="stats-right">
      <div class="stat-item" v-if="!isGameActive">
        <v-icon size="14">mdi-keyboard</v-icon>
        <span>{{ gameMode === 'sprint' ? 'Sprint Mode - Type to start!' : 'Type exact matches to continue' }}</span>
      </div>
      <div class="stat-item" v-if="isGameActive && gameMode === 'timed'">
        <v-icon size="14" :color="timeRemaining <= 10 ? 'error' : 'info'">mdi-timer</v-icon>
        <span :class="{ 'time-warning': timeRemaining <= 10 }">{{ formatTime(timeRemaining) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStatsStore } from '../stores/statsStore'

const statsStore = useStatsStore()


const props = defineProps({
  locPerMinute: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 100
  },
  gameMode: {
    type: String,
    default: 'sprint'
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  timeRemaining: {
    type: Number,
    default: 60
  },
  wordsCompleted: {
    type: Number,
    default: 0
  },
  isGameOver: {
    type: Boolean,
    default: false
  },
  isGameActive: {
    type: Boolean,
    default: false
  },
  gameState: {
    type: String,
    default: 'waiting'
  },
  avgWPM: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  }
})

// Utility function
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.vscode-statusbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #007ACC;
  color: white;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  height: 24px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  z-index: 100;
}

.stats-left,
.stats-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  cursor: default;
  padding: 2px 6px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.stat-item span {
  font-size: 12px;
  line-height: 1;
}

.pause-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(255, 152, 0, 0.2);
  border-radius: 3px;
  font-weight: 600;
  animation: pulse-pause 1.5s ease-in-out infinite;
}

@keyframes pulse-pause {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.time-warning {
  animation: pulse-text 1s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* VS Code theme integration */
:global(.theme-vscode-dark) .vscode-statusbar {
  background: #007ACC;
}

:global(.theme-vscode-light) .vscode-statusbar {
  background: #0078D4;
}

:global(.theme-dracula) .vscode-statusbar {
  background: #6272A4;
}

:global(.theme-monokai) .vscode-statusbar {
  background: #75715E;
}

:global(.theme-github-dark) .vscode-statusbar {
  background: #0969DA;
}

:global(.theme-shades-of-purple) .vscode-statusbar {
  background: #A599E9;
}
</style>