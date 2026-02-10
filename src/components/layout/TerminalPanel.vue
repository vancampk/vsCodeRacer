<template>
  <div class="bottom-panel" v-show="show">
    <div class="panel-header">
      <div class="panel-tabs">
        <div class="panel-tab active">
          <v-icon size="16">mdi-console</v-icon>
          <span>TERMINAL</span>
        </div>
      </div>
      <v-icon size="16" @click="$emit('close')" style="cursor: pointer;">mdi-close</v-icon>
    </div>
    <div class="terminal-content">
      <div class="terminal-line">
        <span class="terminal-prompt">coderacer@terminal:~$</span>
        <span class="terminal-command">stats --live</span>
      </div>
      <div class="terminal-output">
        <div class="output-line">
          <span class="output-label">Current LOC/min:</span>
          <span class="output-value">{{ locPerMinute }}</span>
        </div>
        <div class="output-line">
          <span class="output-label">Accuracy:</span>
          <span class="output-value">{{ accuracy }}%</span>
        </div>
        <div class="output-line">
          <span class="output-label">Lines Completed:</span>
          <span class="output-value">{{ linesCompleted }}</span>
        </div>
        <div class="output-line">
          <span class="output-label">Time Elapsed:</span>
          <span class="output-value">{{ formatTime(timeElapsed) }}</span>
        </div>
        <div class="output-line">
          <span class="output-label">Game Mode:</span>
          <span class="output-value">{{ formatGameMode(gameMode) }}</span>
        </div>
        <div class="output-line">
          <span class="output-label">Average WPM:</span>
          <span class="output-value">{{ averageWpm }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  locPerMinute: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 100
  },
  linesCompleted: {
    type: Number,
    default: 0
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  gameMode: {
    type: String,
    default: 'none'
  },
  averageWpm: {
    type: Number,
    default: 0
  }
})

defineEmits(['close'])

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatGameMode = (mode) => {
  const modeMap = {
    'free': 'Free Code',
    'sprint': '10 Line Sprint',
    'challenge': '60s Challenge',
    'snippets': 'Snippets',
    'settings': 'Settings',
    'stats': 'Statistics',
    'instructions': 'README',
    'none': 'No Game Active'
  }
  return modeMap[mode] || mode
}
</script>

<style scoped>
.bottom-panel {
  height: 200px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  height: 35px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
}

.panel-tabs {
  display: flex;
  gap: 8px;
}

.panel-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-primary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
}

.panel-tab.active {
  border-bottom-color: var(--text-accent);
}

.panel-tab:hover {
  background: var(--bg-tertiary);
}

.terminal-content {
  flex: 1;
  padding: 12px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  overflow: auto;
}

.terminal-line {
  margin-bottom: 8px;
  color: var(--text-primary);
  text-align: left;
}

.terminal-prompt {
  color: var(--text-accent);
  margin-right: 8px;
}

.terminal-command {
  color: var(--text-primary);
}

.terminal-output {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 8px;
}

.output-line {
  display: flex;
  gap: 12px;
  padding: 4px 0;
  color: var(--text-secondary);
}

.output-label {
  min-width: 120px;
}

.output-value {
  color: var(--text-accent);
  font-weight: 600;
}

/* Scrollbar styling */
.terminal-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.terminal-content::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 5px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-color);
}
</style>
