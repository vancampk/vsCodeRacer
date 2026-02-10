<template>
  <div class="side-panel" v-show="activePanel">
    <!-- File Explorer -->
    <div v-if="activePanel === 'explorer'" class="panel-content">
      <div class="panel-header">
        <span class="panel-title">CODERACER MODES</span>
        <v-icon size="16" @click="$emit('close-panel')">mdi-close</v-icon>
      </div>
      <div class="file-tree">
        <div class="file-item" :class="{ active: gameMode === 'free' }" @click="$emit('open-tab', 'free')">
          <v-icon size="16" class="file-icon">{{ getLanguageIcon(languagePreference === 'all' ? currentLanguage : languagePreference) }}</v-icon>
          <span>FreeCode.{{ getLanguageExtension(languagePreference === 'all' ? currentLanguage : languagePreference) }}</span>
        </div>
        <div class="file-item" :class="{ active: gameMode === 'sprint' }" @click="$emit('open-tab', 'sprint')">
          <v-icon size="16" class="file-icon">{{ getLanguageIcon(languagePreference === 'all' ? currentLanguage : languagePreference) }}</v-icon>
          <span>Sprint10.{{ getLanguageExtension(languagePreference === 'all' ? currentLanguage : languagePreference) }}</span>
        </div>
        <div class="file-item" :class="{ active: gameMode === 'challenge' }" @click="$emit('open-tab', 'challenge')">
          <v-icon size="16" class="file-icon">mdi-language-python</v-icon>
          <span>Challenge60s.py</span>
        </div>
        <div class="file-separator"></div>
        <div class="file-item" :class="{ active: gameMode === 'snippets' }" @click="$emit('open-tab', 'snippets')">
          <v-icon size="16" class="file-icon">mdi-code-braces</v-icon>
          <span>Snippets.md</span>
        </div>
        <div class="file-separator"></div>
        <div class="file-item" :class="{ active: gameMode === 'stats' }" @click="$emit('open-tab', 'stats')">
          <v-icon size="16" class="file-icon">mdi-chart-box</v-icon>
          <span>Stats.json</span>
        </div>
        <div class="file-item" :class="{ active: gameMode === 'instructions' }" @click="$emit('open-tab', 'instructions')">
          <v-icon size="16" class="file-icon">mdi-information-outline</v-icon>
          <span>README.md</span>
        </div>
      </div>
    </div>
    
    <!-- Search Panel -->
    <div v-if="activePanel === 'search'" class="panel-content">
      <div class="panel-header">
        <span class="panel-title">SEARCH OPTIONS</span>
        <v-icon size="16" @click="$emit('close-panel')">mdi-close</v-icon>
      </div>
      <div class="search-content">
        <div class="search-option" @click="$emit('open-tab', 'free')">
          <v-icon size="16">mdi-code-tags</v-icon>
          <div class="search-text">
            <div class="search-title">Free Practice</div>
            <div class="search-desc">Unlimited coding practice</div>
          </div>
        </div>
        <div class="search-option" @click="$emit('open-tab', 'sprint')">
          <v-icon size="16">mdi-timer</v-icon>
          <div class="search-text">
            <div class="search-title">Sprint Mode</div>
            <div class="search-desc">Complete 10 lines quickly</div>
          </div>
        </div>
        <div class="search-option" @click="$emit('open-tab', 'challenge')">
          <v-icon size="16">mdi-trophy</v-icon>
          <div class="search-text">
            <div class="search-title">60s Challenge</div>
            <div class="search-desc">Race against time</div>
          </div>
        </div>
        <div class="search-divider"></div>
        <div class="search-option" @click="$emit('open-tab', 'snippets')">
          <v-icon size="16">mdi-code-braces</v-icon>
          <div class="search-text">
            <div class="search-title">All Code Snippets</div>
            <div class="search-desc">Browse all available code snippets</div>
          </div>
        </div>
        <div class="search-option" @click="$emit('open-tab', 'stats')">
          <v-icon size="16">mdi-chart-box</v-icon>
          <div class="search-text">
            <div class="search-title">Statistics</div>
            <div class="search-desc">View your typing stats and progress</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Git Panel (Stats) -->
    <div v-if="activePanel === 'git'" class="panel-content">
      <div class="panel-header">
        <span class="panel-title">GAME STATS</span>
        <v-icon size="16" @click="$emit('close-panel')">mdi-close</v-icon>
      </div>
      <div class="git-content">
        <!-- Current Session Stats -->
        <div class="stats-section-title">Current Session</div>
        <div class="stat-line">
          <v-icon size="16" color="success">mdi-target</v-icon>
          <span>Accuracy: {{ accuracy }}%</span>
        </div>
        <div class="stat-line">
          <v-icon size="16" color="info">mdi-code-tags</v-icon>
          <span>LOC/min: {{ locPerMinute }}</span>
        </div>
        <div class="stat-line">
          <v-icon size="16" color="warning">mdi-clock</v-icon>
          <span>Time: {{ formatTime(timeElapsed) }}</span>
        </div>
        <div class="stat-line">
          <v-icon size="16">mdi-format-list-numbered</v-icon>
          <span>Lines: {{ linesCompleted }}</span>
        </div>
        
        <!-- Last Game Stats -->
        <div>
          <div class="stats-section-title">Last Game</div>
          <div class="stat-line" v-if="lastGameStats">
            <v-icon size="16" color="info">mdi-speedometer</v-icon>
            <span>WPM: {{ lastGameStats.wpm }}</span>
          </div>
          <div class="stat-line" v-if="lastGameStats">
            <v-icon size="16" color="success">mdi-target</v-icon>
            <span>Accuracy: {{ lastGameStats.accuracy }}%</span>
          </div>
          <div class="stat-line" v-if="lastGameStats">
            <v-icon size="16" color="info">mdi-code-tags</v-icon>
            <span>LOC/min: {{ lastGameStats.locPerMinute }}</span>
          </div>
          <div class="stat-line" v-if="lastGameStats">
            <v-icon size="16">mdi-format-list-numbered</v-icon>
            <span>Lines: {{ lastGameStats.linesCompleted }}</span>
          </div>
          <div class="stat-line" v-if="lastGameStats">
            <v-icon size="16" color="warning">mdi-clock</v-icon>
            <span>Time: {{ formatTime(lastGameStats.timeElapsed) }}</span>
          </div>
          <div class="stat-line" v-if="!lastGameStats">
            <span style="color: var(--text-secondary); font-style: italic;">No games played yet</span>
          </div>
        </div>
        
        <!-- Rolling Averages -->
        <div>
          <div class="stats-section-title">Rolling Average (Last {{ Math.min(sessionHistoryLength || 0, 10) }})</div>
          <div class="stat-line">
            <v-icon size="16" color="info">mdi-chart-line</v-icon>
            <span>Avg WPM: {{ averageWPM || 0 }}</span>
          </div>
          <div class="stat-line">
            <v-icon size="16" color="info">mdi-code-tags</v-icon>
            <span>Avg LOC/min: {{ averageLOCPerMinute || 0 }}</span>
          </div>
          <div class="stat-line">
            <v-icon size="16" color="success">mdi-target</v-icon>
            <span>Avg Accuracy: {{ averageAccuracy || 0 }}%</span>
          </div>
          <div class="stat-line">
            <v-icon size="16" :color="consistencyScore >= 80 ? 'success' : 'info'">mdi-chart-bell-curve</v-icon>
            <span>Consistency: {{ consistencyScore || 0 }}%</span>
          </div>
        </div>
        
        <!-- Personal Best -->
        <div>
          <div class="stats-section-title">Personal Best</div>
          <div class="stat-line">
            <v-icon size="16" color="warning">mdi-trophy</v-icon>
            <span>Best WPM: {{ bestWPM || 0 }}</span>
          </div>
          <div class="stat-line">
            <v-icon size="16" color="warning">mdi-trophy</v-icon>
            <span>Best LOC/min: {{ bestLOCPerMinute || 0 }}</span>
          </div>
          <div class="stat-line">
            <v-icon size="16" color="warning">mdi-trophy</v-icon>
            <span>Best Accuracy: {{ bestAccuracy || 0 }}%</span>
          </div>
        </div>
        
        <!-- Lifetime -->
        <div>
          <div class="stats-section-title">Lifetime Stats</div>
          <div class="stat-line">
            <v-icon size="16">mdi-counter</v-icon>
            <span>Total Sessions: {{ totalSessionsPlayed || 0 }}</span>
          </div>
          <div class="stat-line">
            <v-icon size="16">mdi-format-list-numbered</v-icon>
            <span>Total Lines: {{ lifetimeLinesCompleted || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activePanel: {
    type: String,
    default: null
  },
  gameMode: {
    type: String,
    default: null
  },
  languagePreference: {
    type: String,
    default: 'all'
  },
  currentLanguage: {
    type: String,
    default: 'javascript'
  },
  accuracy: {
    type: Number,
    default: 100
  },
  locPerMinute: {
    type: Number,
    default: 0
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  linesCompleted: {
    type: Number,
    default: 0
  },
  lastGameStats: {
    type: Object,
    default: null
  },
  sessionHistoryLength: {
    type: Number,
    default: 0
  },
  averageWPM: {
    type: Number,
    default: 0
  },
  averageLOCPerMinute: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: 0
  },
  consistencyScore: {
    type: Number,
    default: 100
  },
  bestWPM: {
    type: Number,
    default: 0
  },
  bestLOCPerMinute: {
    type: Number,
    default: 0
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  totalSessionsPlayed: {
    type: Number,
    default: 0
  },
  lifetimeLinesCompleted: {
    type: Number,
    default: 0
  }
})

defineEmits(['close-panel', 'open-tab'])

// Helper functions
const getLanguageIcon = (language) => {
  const iconMap = {
    'javascript': 'mdi-language-javascript',
    'typescript': 'mdi-language-typescript',
    'python': 'mdi-language-python',
    'java': 'mdi-language-java',
    'go': 'mdi-language-go',
    'rust': 'mdi-language-rust',
    'react': 'mdi-react',
    'vue': 'mdi-vuejs',
    'nodejs': 'mdi-nodejs',
    'sql': 'mdi-database',
    'css': 'mdi-language-css3',
    'shell': 'mdi-console',
    'regex': 'mdi-regex'
  }
  return iconMap[language] || 'mdi-file-code'
}

const getLanguageExtension = (language) => {
  const extensionMap = {
    'javascript': 'js',
    'typescript': 'ts',
    'python': 'py',
    'java': 'java',
    'go': 'go',
    'rust': 'rs',
    'react': 'jsx',
    'vue': 'vue',
    'nodejs': 'js',
    'sql': 'sql',
    'css': 'css',
    'shell': 'sh',
    'regex': 'txt'
  }
  return extensionMap[language] || 'txt'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.side-panel {
  width: 280px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  min-height: 0;
}

.panel-content {
  height: 100%;
}

.panel-header {
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 1;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}

.file-tree {
  padding: 8px 0;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 13px;
  transition: background 0.15s ease;
}

.file-item:hover {
  background: var(--bg-secondary);
}

.file-item.active {
  background: var(--highlight-bg);
  color: var(--text-accent);
}

.file-icon {
  flex-shrink: 0;
}

.file-separator {
  height: 1px;
  background: var(--border-color);
  margin: 8px 16px;
}

.search-content {
  padding: 8px;
}

.search-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s ease;
  margin-bottom: 4px;
}

.search-option:hover {
  background: var(--bg-secondary);
}

.search-text {
  flex: 1;
}

.search-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.search-desc {
  font-size: 11px;
  color: var(--text-secondary);
}

.search-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
}

.git-content {
  padding: 16px;
}

.stats-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin: 16px 0 8px 0;
  text-transform: uppercase;
}

.stats-section-title:first-child {
  margin-top: 0;
}

.stat-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 13px;
  color: var(--text-primary);
}

/* Scrollbar styling */
.side-panel::-webkit-scrollbar {
  width: 10px;
}

.side-panel::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.side-panel::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 5px;
}

.side-panel::-webkit-scrollbar-thumb:hover {
  background: var(--border-color);
}
</style>
