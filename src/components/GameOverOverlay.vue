<template>
  <v-dialog
    :model-value="isGameOver"
    persistent
    max-width="480px"
    class="game-over-dialog"
  >
    <v-card class="vscode-dialog" elevation="4">
      <v-card-title class="dialog-header">
        <v-icon :icon="gameMode === 'sprint' ? 'mdi-flag-checkered' : 'mdi-check-circle'" size="20"></v-icon>
        {{ gameMode === 'sprint' ? 'Sprint Complete!' : 'Session Complete!' }}
      </v-card-title>

      <v-card-text class="compact-stats">
        <!-- Current Session Stats -->
        <div class="section-title">This Session</div>
        <v-row dense>
          <v-col cols="6">
            <div class="stat-compact">
              <v-icon size="16">mdi-format-list-numbered</v-icon>
              <span class="stat-value-compact">{{ wordsCompleted }}</span>
              <span class="stat-label-compact">Lines</span>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="stat-compact">
              <v-icon size="16">mdi-timer</v-icon>
              <span class="stat-value-compact">{{ formatTime(timeElapsed) }}</span>
              <span class="stat-label-compact">Time</span>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="stat-compact">
              <v-icon size="16">mdi-code-tags</v-icon>
              <span class="stat-value-compact">{{ locPerMinute }}</span>
              <span class="stat-label-compact">LOC/min</span>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="stat-compact">
              <v-icon size="16" :color="accuracy >= 95 ? 'success' : 'warning'">mdi-target</v-icon>
              <span class="stat-value-compact">{{ accuracy }}%</span>
              <span class="stat-label-compact">Accuracy</span>
            </div>
          </v-col>
        </v-row>
        
        <!-- Rolling Averages -->
        <div class="section-title" v-if="averageWPM > 0">Rolling Average (Last 10)</div>
        <v-row dense v-if="averageWPM > 0">
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14">mdi-chart-line</v-icon>
              <span class="stat-value-compact">{{ averageWPM }}</span>
              <span class="stat-label-compact">Avg WPM</span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14">mdi-code-tags</v-icon>
              <span class="stat-value-compact">{{ averageLOC }}</span>
              <span class="stat-label-compact">Avg LOC/min</span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14">mdi-target</v-icon>
              <span class="stat-value-compact">{{ averageAccuracy }}%</span>
              <span class="stat-label-compact">Avg Acc</span>
            </div>
          </v-col>
        </v-row>
        
        <!-- Best Scores -->
        <div class="section-title" v-if="bestWPM > 0">Personal Best</div>
        <v-row dense v-if="bestWPM > 0">
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14" color="warning">mdi-trophy</v-icon>
              <span class="stat-value-compact">{{ bestWPM }}</span>
              <span class="stat-label-compact">WPM</span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14" color="warning">mdi-trophy</v-icon>
              <span class="stat-value-compact">{{ bestLOC }}</span>
              <span class="stat-label-compact">LOC/min</span>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="stat-compact small">
              <v-icon size="14" color="warning">mdi-trophy</v-icon>
              <span class="stat-value-compact">{{ bestAccuracy }}%</span>
              <span class="stat-label-compact">Accuracy</span>
            </div>
          </v-col>
        </v-row>
        
        <!-- Consistency Score -->
        <v-row dense v-if="consistencyScore > 0">
          <v-col cols="12">
            <div class="stat-compact">
              <v-icon size="16" :color="consistencyScore >= 80 ? 'success' : 'info'">mdi-chart-bell-curve</v-icon>
              <span class="stat-value-compact">{{ consistencyScore }}%</span>
              <span class="stat-label-compact">Consistency Score</span>
            </div>
          </v-col>
        </v-row>
        
        <div class="performance-summary">
          {{ getPerformanceMessage() }}
        </div>
      </v-card-text>

      <v-card-actions class="dialog-actions">
        <v-btn
          color="primary"
          variant="outlined"
          prepend-icon="mdi-refresh"
          @click="$emit('resetGame')"
          size="small"
          class="action-btn"
        >
          {{ gameMode === 'sprint' ? 'Try Again' : 'Play Again' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useStatsStore } from '../stores/statsStore'

const statsStore = useStatsStore()


const props = defineProps({
  isGameOver: {
    type: Boolean,
    default: false
  },
  gameMode: {
    type: String,
    default: 'sprint'
  },
  wordsCompleted: {
    type: Number,
    default: 0
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  locPerMinute: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 100
  },
  averageWPM: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  averageLOC: {
    type: Number,
    default: 0
  },
  bestWPM: {
    type: Number,
    default: 0
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  bestLOC: {
    type: Number,
    default: 0
  },
  consistencyScore: {
    type: Number,
    default: 0
  }
})


const emit = defineEmits(['resetGame'])

// Utility function
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Performance evaluation methods
const getPerformanceColor = () => {
  const score = getPerformanceScore()
  if (score >= 85) return 'success'
  if (score >= 70) return 'warning'
  return 'info'
}

const getPerformanceIcon = () => {
  const score = getPerformanceScore()
  if (score >= 85) return 'mdi-trophy'
  if (score >= 70) return 'mdi-thumb-up'
  return 'mdi-lightbulb'
}

const getPerformanceScore = () => {
  // Combine accuracy and speed metrics for overall score
  const accuracyWeight = 0.6
  const speedWeight = 0.4
  
  // Speed benchmark: 15 LOC/min is good, 25+ is excellent
  const speedScore = Math.min(100, (props.locPerMinute / 25) * 100)
  
  return (props.accuracy * accuracyWeight) + (speedScore * speedWeight)
}

const getPerformanceTitle = () => {
  const score = getPerformanceScore()
  if (score >= 85) return 'Excellent Performance!'
  if (score >= 70) return 'Good Job!'
  return 'Keep Practicing!'
}

const getPerformanceMessage = () => {
  const { accuracy, locPerMinute } = props
  
  if (accuracy >= 95 && locPerMinute >= 20) {
    return 'You have great accuracy and speed! You\'re coding like a pro!'
  } else if (accuracy >= 95) {
    return 'Perfect accuracy! Focus on building up your typing speed. '
  } else if (locPerMinute >= 20) {
    return 'Great speed! Work on accuracy to become more efficient. '
  } else if (accuracy >= 85) {
    return 'Good accuracy! Keep practicing to improve your speed. '
  } else {
    return 'Practice makes perfect! Focus on accuracy first, then speed. '
  }
}
</script>

<style scoped>
.vscode-dialog {
  background: var(--bg-secondary) !important;
  border: 1px solid var(--border-color) !important;
  font-family: 'Fira Code', monospace;
}

.dialog-header {
  background: var(--bg-tertiary) !important;
  color: var(--text-primary) !important;
  font-family: 'Fira Code', monospace !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  padding: 8px 16px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  border-bottom: 1px solid var(--border-color) !important;
}

.compact-stats {
  padding: 16px !important;
}

.stat-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
}

.stat-compact.small {
  padding: 6px;
  font-size: 13px;
}

.stat-compact.small .stat-value-compact {
  font-size: 14px !important;
}

.stat-compact.small .stat-label-compact {
  font-size: 10px !important;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-left: 4px;
}

.stat-value-compact {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: var(--text-accent) !important;
  margin-left: auto;
}

.stat-label-compact {
  font-size: 11px !important;
  color: var(--text-secondary) !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.performance-summary {
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.dialog-actions {
  padding: 8px 16px 12px 16px !important;
  justify-content: center !important;
  border-top: 1px solid var(--border-color) !important;
  background: var(--bg-tertiary) !important;
}

.action-btn {
  font-family: 'Fira Code', monospace !important;
  font-weight: 500 !important;
  text-transform: none !important;
  font-size: 12px !important;
}
</style>