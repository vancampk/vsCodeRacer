<template>
  <v-app class="typing-game" @click="handleGameClick">
    <!-- VS Code Title Bar -->
    <div class="title-bar">
      <div class="title-bar-left">
        <GlitchLogo />
      </div>
      
      <div class="title-bar-center">
        
      </div>
      
      <div class="title-bar-right">
       <GameControls 
          @save-and-reset="saveAndReset" 
        />
      </div>
    </div>
    
    <div class="vscode-layout">
      <!-- Activity Bar (left side) -->
      <div class="activity-bar">
        <div class="activity-icons">
          <div class="activity-icon" :class="{ active: activePanel === 'explorer' }" @click="togglePanel('explorer')">
            <v-icon size="32">mdi-folder-outline</v-icon>
          </div>
          <div class="activity-icon" :class="{ active: activePanel === 'search' }" @click="togglePanel('search')">
            <v-icon size="32">mdi-magnify</v-icon>
          </div>
          <div class="activity-icon" :class="{ active: activePanel === 'git' }" @click="togglePanel('git')">
            <v-icon size="32">mdi-source-branch</v-icon>
          </div>
          <div class="activity-icon" :class="{ active: gameMode === 'stats' }" @click="openTab('stats')">
            <v-icon size="32">mdi-chart-box-outline</v-icon>
          </div>
        </div>
        <div class="activity-logo settings-icon" @click="openTab('settings')">
          <v-icon size="32" color="primary" :class="{ active: gameMode === 'settings' }">mdi-cog-outline</v-icon>
          <span class="settings-badge"></span>
        </div>
      </div>
      
      <!-- Side Panel -->
      <div class="side-panel" v-show="activePanel">
        <!-- File Explorer -->
        <div v-if="activePanel === 'explorer'" class="panel-content">
          <div class="panel-header">
            <span class="panel-title">CODERACER MODES</span>
            <v-icon size="16" @click="activePanel = null">mdi-close</v-icon>
          </div>
          <div class="file-tree">
            <div class="file-item" :class="{ active: gameMode === 'free' }" @click="openTab('free')">
              <v-icon size="16" class="file-icon">{{ getLanguageIcon(settingsStore.languagePreference === 'all' ? currentLanguage.language : settingsStore.languagePreference) }}</v-icon>
              <span>FreeCode.{{ getLanguageExtension(settingsStore.languagePreference === 'all' ? currentLanguage.language : settingsStore.languagePreference) }}</span>
            </div>
            <div class="file-item" :class="{ active: gameMode === 'sprint' }" @click="openTab('sprint')">
              <v-icon size="16" class="file-icon">{{ getLanguageIcon(settingsStore.languagePreference === 'all' ? currentLanguage.language : settingsStore.languagePreference) }}</v-icon>
              <span>Sprint10.{{ getLanguageExtension(settingsStore.languagePreference === 'all' ? currentLanguage.language : settingsStore.languagePreference) }}</span>
            </div>
            <div class="file-item" :class="{ active: gameMode === 'challenge' }" @click="openTab('challenge')">
              <v-icon size="16" class="file-icon">mdi-language-python</v-icon>
              <span>Challenge60s.py</span>
            </div>
            <div class="file-separator"></div>
            <div class="file-item" :class="{ active: gameMode === 'snippets' }" @click="openTab('snippets')">
              <v-icon size="16" class="file-icon">mdi-code-braces</v-icon>
              <span>Snippets.md</span>
            </div>
            <div class="file-separator"></div>
            <div class="file-item" :class="{ active: gameMode === 'instructions' }" @click="openTab('instructions')">
              <v-icon size="16" class="file-icon">mdi-information-outline</v-icon>
              <span>README.md</span>
            </div>
          </div>
        </div>
        
        <!-- Search Panel -->
        <div v-if="activePanel === 'search'" class="panel-content">
          <div class="panel-header">
            <span class="panel-title">SEARCH OPTIONS</span>
            <v-icon size="16" @click="activePanel = null">mdi-close</v-icon>
          </div>
          <div class="search-content">
            <div class="search-option" @click="openTab('free')">
              <v-icon size="16">mdi-code-tags</v-icon>
              <div class="search-text">
                <div class="search-title">Free Practice</div>
                <div class="search-desc">Unlimited coding practice</div>
              </div>
            </div>
            <div class="search-option" @click="openTab('sprint')">
              <v-icon size="16">mdi-timer</v-icon>
              <div class="search-text">
                <div class="search-title">Sprint Mode</div>
                <div class="search-desc">Complete 10 lines quickly</div>
              </div>
            </div>
            <div class="search-option" @click="openTab('challenge')">
              <v-icon size="16">mdi-trophy</v-icon>
              <div class="search-text">
                <div class="search-title">60s Challenge</div>
                <div class="search-desc">Race against time</div>
              </div>
            </div>
            <div class="search-divider"></div>
            <div class="search-option" @click="openTab('snippets')">
              <v-icon size="16">mdi-code-braces</v-icon>
              <div class="search-text">
                <div class="search-title">All Code Snippets</div>
                <div class="search-desc">Browse all available code snippets</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Git Panel -->
        <div v-if="activePanel === 'git'" class="panel-content">
          <div class="panel-header">
            <span class="panel-title">GAME STATS</span>
            <v-icon size="16" @click="activePanel = null">mdi-close</v-icon>
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
              <span>Lines: {{ wordsCompleted }}</span>
            </div>
            
            <!-- Last Game Stats -->
            <div>
              <div class="stats-section-title">Last Game</div>
              <div class="stat-line" v-if="statsStore.lastGameStats">
                <v-icon size="16" color="info">mdi-speedometer</v-icon>
                <span>WPM: {{ statsStore.lastGameStats.wpm }}</span>
              </div>
              <div class="stat-line" v-if="statsStore.lastGameStats">
                <v-icon size="16" color="success">mdi-target</v-icon>
                <span>Accuracy: {{ statsStore.lastGameStats.accuracy }}%</span>
              </div>
              <div class="stat-line" v-if="statsStore.lastGameStats">
                <v-icon size="16" color="info">mdi-code-tags</v-icon>
                <span>LOC/min: {{ statsStore.lastGameStats.locPerMinute }}</span>
              </div>
              <div class="stat-line" v-if="statsStore.lastGameStats">
                <v-icon size="16">mdi-format-list-numbered</v-icon>
                <span>Lines: {{ statsStore.lastGameStats.linesCompleted }}</span>
              </div>
              <div class="stat-line" v-if="statsStore.lastGameStats">
                <v-icon size="16" color="warning">mdi-clock</v-icon>
                <span>Time: {{ formatTime(statsStore.lastGameStats.timeElapsed) }}</span>
              </div>
              <div class="stat-line" v-if="!statsStore.lastGameStats">
                <span style="color: var(--text-secondary); font-style: italic;">No games played yet</span>
              </div>
            </div>
            
            <!-- Rolling Averages -->
            <div>
              <div class="stats-section-title">Rolling Average (Last {{ Math.min(statsStore.sessionHistory.length || 0, 10) }})</div>
              <div class="stat-line">
                <v-icon size="16" color="info">mdi-chart-line</v-icon>
                <span>Avg WPM: {{ statsStore.averageWPM || 0 }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="info">mdi-code-tags</v-icon>
                <span>Avg LOC/min: {{ statsStore.averageLOCPerMinute || 0 }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="success">mdi-target</v-icon>
                <span>Avg Accuracy: {{ statsStore.averageAccuracy || 0 }}%</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" :color="statsStore.consistencyScore >= 80 ? 'success' : 'info'">mdi-chart-bell-curve</v-icon>
                <span>Consistency: {{ statsStore.consistencyScore || 0 }}%</span>
              </div>
            </div>
            
            <!-- Personal Best -->
            <div>
              <div class="stats-section-title">Personal Best</div>
              <div class="stat-line">
                <v-icon size="16" color="warning">mdi-trophy</v-icon>
                <span>Best WPM: {{ statsStore.bestWPM || 0 }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="warning">mdi-trophy</v-icon>
                <span>Best LOC/min: {{ statsStore.bestLOCPerMinute || 0 }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="warning">mdi-trophy</v-icon>
                <span>Best Accuracy: {{ statsStore.bestAccuracy || 0 }}%</span>
              </div>
            </div>
            
            <!-- Lifetime Stats -->
            <div>
              <div class="stats-section-title">Lifetime Totals</div>
              <div class="stat-line">
                <v-icon size="16" color="primary">mdi-infinity</v-icon>
                <span>Total Lines: {{ (statsStore.lifetimeLinesCompleted || 0).toLocaleString() }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="primary">mdi-clock-outline</v-icon>
                <span>Total Time: {{ formatTime(statsStore.lifetimeTotalTime || 0) }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="primary">mdi-keyboard</v-icon>
                <span>Total Chars: {{ (statsStore.lifetimeTotalCharacters || 0).toLocaleString() }}</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="success">mdi-target</v-icon>
                <span>Lifetime Accuracy: {{ statsStore.lifetimeAccuracy || 0 }}%</span>
              </div>
              <div class="stat-line">
                <v-icon size="16" color="info">mdi-code-tags</v-icon>
                <span>Lifetime LOC/min: {{ statsStore.lifetimeAverageLOCPerMinute || 0 }}</span>
              </div>
            </div>
            
            <!-- Overall Stats -->
            <div>
              <div class="stats-section-title">Overall</div>
              <div class="stat-line">
                <v-icon size="16">mdi-chart-box</v-icon>
                <span>Total Sessions: {{ statsStore.totalSessionsPlayed || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Editor Area -->
      <div class="editor-container">
        <!-- Tab Bar -->
        <div class="tab-bar">
          <div class="tab-left">
            <!-- Multiple Tabs -->
            <div class="tab-container">
              <div 
                v-for="(tab, index) in openTabs" 
                :key="tab.id"
                class="file-tab"
                :class="{ 
                  active: activeTabIndex === index,
                  'drag-over': dragOverTabIndex === index && draggedTabIndex !== index
                }"
                draggable="true"
                @dragstart="handleDragStart(index, $event)"
                @dragend="handleDragEnd($event)"
                @dragover="handleDragOver(index, $event)"
                @dragenter="handleDragEnter(index)"
                @dragleave="handleDragLeave()"
                @drop="handleDrop(index, $event)"
                @click="switchToTab(index)"
              >
                <v-icon size="16" class="file-type-icon">{{ getFileIconForMode(tab.mode) }}</v-icon>
                <span class="tab-filename">{{ getFileNameForMode(tab.mode) }}</span>
                <v-icon 
                  size="14" 
                  class="tab-close" 
                  @click.stop="closeTab(index)"
                >mdi-close</v-icon>
              </div>
              <!-- Drop zone at the end -->
              <div 
                v-if="openTabs.length > 0"
                class="tab-drop-zone"
                :class="{ 'drag-over': dragOverTabIndex === openTabs.length }"
                @dragover="handleDragOver(openTabs.length, $event)"
                @dragenter="handleDragEnter(openTabs.length)"
                @dragleave="handleDragLeave()"
                @drop="handleDrop(openTabs.length, $event)"
              ></div>
            </div>
            
            <!-- Empty state when no tabs -->
            <div class="empty-tab" v-if="openTabs.length === 0">
              <span class="empty-text">No file open</span>
            </div>
          </div>
          <div class="tab-actions">
            <v-icon size="16" class="panel-toggle" @click="showBottomPanel = !showBottomPanel">mdi-terminal</v-icon>
          </div>
        </div>
        
        <!-- Editor Content -->
        <div class="editor-content" v-if="gameMode && openTabs.length > 0">
          <!-- Stats Panel in Main Editor -->
          <StatsPanel v-if="gameMode === 'stats'" @close="closeActiveTab" />
          
          <!-- Settings Panel in Main Editor -->
          <SettingsPanel v-if="gameMode === 'settings'" @close="closeActiveTab" />
          
          <!-- Instructions Panel in Main Editor -->
          <InstructionsPanel v-if="gameMode === 'instructions'" />
          
          <!-- Dynamic Component Based on Game Mode -->
          <component 
            v-else-if="currentModeComponent"
            :is="currentModeComponent"
            :key="gameStore.resetCounter"
          />
        </div>
        
        <!-- Empty State -->
        <div class="editor-content empty-editor" v-else>
          <div class="empty-state">
            <v-icon size="48" color="secondary">mdi-file-code-outline</v-icon>
            <h3>No File Open</h3>
            <p>Select a file from the Explorer panel to start coding</p>
            <v-btn 
              variant="outlined" 
              @click="activePanel = 'explorer'"
              class="open-explorer-btn"
            >
              <v-icon size="16" style="padding-right: 12px;">mdi-folder-open</v-icon>
              Open Explorer
            </v-btn>
          </div>
        </div>
        
        <!-- Bottom Panel -->
        <div class="bottom-panel" v-show="showBottomPanel">
          <div class="panel-header">
            <div class="panel-tabs">
              <div class="panel-tab active">
                <v-icon size="16">mdi-console</v-icon>
                <span>TERMINAL</span>
              </div>
            </div>
            <v-icon size="16" @click="showBottomPanel = false">mdi-close</v-icon>
          </div>
          <div class="terminal-content">
            <div class="terminal-line">
              <span class="terminal-prompt">coderacer@terminal:~$</span>
              <span class="terminal-command">stats --live</span>
            </div>
            <div class="terminal-output">
              <div class="stat-output">
                <span class="stat-label">Mode:</span> <span class="stat-value">{{ gameMode ? gameMode.toUpperCase() : 'NO FILE OPEN' }}</span>
              </div>
              <div class="stat-output">
                <span class="stat-label">LOC/min:</span> <span class="stat-value stat-number">{{ gameMode ? locPerMinute : 0 }}</span>
              </div>
              <div class="stat-output">
                <span class="stat-label">Accuracy:</span> <span class="stat-value stat-number">{{ gameMode ? accuracy : 100 }}%</span>
              </div>
              <div class="stat-output">
                <span class="stat-label">Time:</span> <span class="stat-value">{{ gameMode ? formatTime(timeElapsed) : '0:00' }}</span>
              </div>
              <div class="stat-output">
                <span class="stat-label">Completed:</span> <span class="stat-value stat-number">{{ gameMode ? wordsCompleted : 0 }}</span>
              </div>
              <div class="stat-output" v-if="gameMode && isGameActive">
                <span class="stat-label">Status:</span> <span class="stat-value stat-success">● ACTIVE</span>
              </div>
              <div class="stat-output" v-else>
                <span class="stat-label">Status:</span> <span class="stat-value stat-secondary">● READY</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <!-- Status Bar -->
    <StatsBar 
      :loc-per-minute="gameMode ? locPerMinute : 0"
      :accuracy="gameMode ? accuracy : 100"
      :game-mode="gameMode || 'none'"
      :time-elapsed="gameMode ? gameStore.timer : 0"
      :time-remaining="gameMode ? timeRemaining : 0"
      :words-completed="gameMode ? wordsCompleted : 0"
      :is-game-over="gameMode ? isGameOver : false"
      :is-game-active="gameMode ? isGameActive : false"
      :game-state="gameStore.gameState"
      :avg-wpm="statsStore.averageWPM"
      :total-sessions="statsStore.sessionHistory.length"
    />

    <GameOverOverlay 
      :is-game-over="isGameOver"
      :game-mode="gameMode"
      :words-completed="wordsCompleted"
      :time-elapsed="gameStore.timer"
      :loc-per-minute="locPerMinute"
      :accuracy="accuracy"
      :average-wpm="statsStore.averageWPM"
      :average-accuracy="statsStore.averageAccuracy"
      :average-loc="statsStore.averageLOCPerMinute"
      :best-wpm="statsStore.bestWPM"
      :best-accuracy="statsStore.bestAccuracy"
      :best-loc="statsStore.bestLOCPerMinute"
      :consistency-score="statsStore.consistencyScore"
      @reset-game="saveAndReset"
    />

  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useGameStore } from '../stores/gameStore.js'
import { useStatsStore } from '../stores/statsStore.js'
import { useSettingsStore } from '../stores/settingsStore.js'
import { useCurrentLanguage } from '../composables/useCurrentLanguage.js'
import GlitchLogo from './GlitchLogo.vue'
import ThemeSelector from './ThemeSelector.vue'
import GameModeSelector from './GameModeSelector.vue'
import StatsBar from './StatsBar.vue'
import GameOverOverlay from './GameOverOverlay.vue'
import GameControls from './GameControls.vue'
import SettingsPanel from './SettingsPanel.vue'
import StatsPanel from './StatsPanel.vue'
import InstructionsPanel from './InstructionsPanel.vue'

// Import mode components
import FreeCodeMode from './modes/FreeCodeMode.vue'
import SprintMode from './modes/SprintMode.vue'
import ChallengeMode from './modes/ChallengeMode.vue'
import SnippetsViewer from './modes/SnippetsViewer.vue'

// Pinia stores
const gameStore = useGameStore()
const statsStore = useStatsStore()
const settingsStore = useSettingsStore()
const { currentLanguage } = useCurrentLanguage()

// Local UI state only
const inputField = ref(null)
const timedGameDuration = ref(60) // 60 seconds for code
const activePanel = ref('explorer') // Start with file explorer open
const showSettingsPanel = ref(false)
const showBottomPanel = ref(false)
const openTabs = ref([]) // Start with no tabs - user can open files from explorer
const activeTabIndex = ref(-1)
let tabIdCounter = 0

// Drag and drop state
const draggedTabIndex = ref(null)
const dragOverTabIndex = ref(null)

// Game settings
const WORDS_TO_SHOW = 9
const WORD_ITEM_HEIGHT = 40 // pixels - aligned with line spacing

// Initialize game
const initializeGame = () => {
  // Shuffle and select code snippets for the game
  const shuffled = [...CODE_SNIPPETS].sort(() => Math.random() - 0.5)
  
  // For sprint mode, only select exactly 10 lines
  if (gameMode.value === 'sprint') {
    gameWords.value = shuffled.slice(0, sprintTarget.value)
  } else {
    gameWords.value = shuffled.slice(0, 200) // More code for practice
  }
  
  currentWordIndex.value = 0
  currentInput.value = ''
  startTime.value = null
  endTime.value = null
  timeElapsed.value = 0
  timeRemaining.value = timedGameDuration.value
  totalTypedChars.value = 0
  correctChars.value = 0
  wordsCompleted.value = 0
  isGameActive.value = false
  isGameOver.value = false
}

const setGameMode = (mode) => {
  gameMode.value = mode
  saveAndReset()
}

// Computed properties using stores
const currentWord = computed(() => {
  return gameStore.currentText
})

const wordsToShow = computed(() => {
  if (!gameStore.currentSnippet) {
    return []
  }
  
  const lines = gameStore.currentSnippet.split('\n')
  const start = Math.max(0, gameStore.currentLine - 3)
  
  // For FreeCode mode, show many more lines to fill the screen
  const linesToShow = gameStore.gameMode === 'free' ? 30 : WORDS_TO_SHOW
  const end = Math.min(lines.length, start + linesToShow)
  
  return lines.slice(start, end).map((line, index) => ({
    word: line,
    originalIndex: start + index,
    displayIndex: index
  }))
})

const snippetLines = computed(() => {
  if (!gameStore.currentSnippet) return []
  return gameStore.currentSnippet.split('\n')
})

const scrollOffset = computed(() => {
  // Keep current line centered - adjust based on how many lines are above
  const linesAbove = Math.min(3, gameStore.currentLine)
  return (3 - linesAbove) * WORD_ITEM_HEIGHT
})

// Store-based computed properties
const isGameActive = computed(() => gameStore.isGameActive)
const isGameOver = computed(() => gameStore.gameState === 'finished')
const currentInput = computed({
  get: () => gameStore.userInput,
  set: (value) => gameStore.processInput(value)
})
const timeElapsed = computed(() => gameStore.timer)
const timeRemaining = computed(() => {
  if (gameStore.gameMode === 'challenge') {
    return Math.max(0, 60 - gameStore.timer)
  }
  return 60
})
const wordsCompleted = computed(() => gameStore.completedLines)
const accuracy = computed(() => statsStore.accuracy)
const locPerMinute = computed(() => statsStore.calculateLOCPerMinute(gameStore.timer, gameStore.completedLines))
const gameMode = computed(() => {
  if (activeTabIndex.value >= 0 && openTabs.value[activeTabIndex.value]) {
    return openTabs.value[activeTabIndex.value].mode
  }
  return null // Return null when no active tab, not undefined
})

const currentModeComponent = computed(() => {
  switch (gameMode.value) {
    case 'free':
      return FreeCodeMode
    case 'sprint':
      return SprintMode
    case 'challenge':
      return ChallengeMode
    case 'snippets':
      return SnippetsViewer
    case 'settings':
      return null // Settings uses SettingsPanel component directly
    case 'stats':
      return null // Stats uses StatsPanel component directly
    case 'instructions':
      return null // Instructions uses InstructionsPanel component directly
    default:
      return null
  }
})

const selectedTheme = computed(() => settingsStore.selectedTheme)

// Input handling with stores
const handleInput = (event) => {
  // Get the current input value from the event
  const currentInputValue = event.target.value
  
  // Update stats with the current input value
  statsStore.updateStats(currentInputValue, gameStore.currentText)
}

const handleKeyDown = (event) => {
  // Only prevent default for specific keys that might interfere
  if (event.code === 'Tab') {
    event.preventDefault()
  }
}

const saveAndReset = () => {
  // Save current session if there's progress
  if (gameStore.completedLinesCount > 0) {
    const finalStats = statsStore.calculateFinalStats(gameStore.timer, gameStore.completedLinesCount)
    statsStore.saveSession(finalStats)
  }
  
  // Reset the game
  gameStore.resetGame()
  statsStore.resetStats()
  gameStore.generateSnippet() // Regenerate snippets
  nextTick(() => {
    if (inputField.value) {
      inputField.value.focus()
    }
  })
}

const toggleGame = () => {
  if (gameStore.isGameActive) {
    gameStore.pauseGame()
  } else {
    gameStore.startGame()
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePanel = (panel) => {
  if (activePanel.value === panel) {
    activePanel.value = null
  } else {
    activePanel.value = panel
  }
}

const openTab = (mode) => {
  // Check if tab is already open
  const existingIndex = openTabs.value.findIndex(tab => tab.mode === mode)
  if (existingIndex >= 0) {
    // Switch to existing tab
    switchToTab(existingIndex)
    return
  }
  
  // Create new tab
  const newTab = {
    id: ++tabIdCounter,
    mode: mode,
    gameState: null // Could store individual game states per tab
  }
  
  openTabs.value.push(newTab)
  activeTabIndex.value = openTabs.value.length - 1
  gameStore.setGameMode(mode)
}

const switchToTab = (index) => {
  if (index >= 0 && index < openTabs.value.length) {
    // Save FreeCode stats before switching modes
    if (gameStore.gameMode === 'free' && gameStore.gameState === 'playing' && gameStore.completedLinesCount > 0) {
      const finalStats = statsStore.calculateFinalStats(gameStore.timer, gameStore.completedLinesCount)
      statsStore.saveSession(finalStats)
    }
    
    activeTabIndex.value = index
    const tab = openTabs.value[index]
    gameStore.setGameMode(tab.mode)
  }
}

const closeTab = (index = null) => {
  const tabIndex = index !== null ? index : activeTabIndex.value
  
  if (tabIndex < 0 || tabIndex >= openTabs.value.length) return
  
  // Save FreeCode stats before closing
  if (gameStore.gameMode === 'free' && gameStore.gameState === 'playing' && gameStore.completedLinesCount > 0) {
    const finalStats = statsStore.calculateFinalStats(gameStore.timer, gameStore.completedLinesCount)
    statsStore.saveSession(finalStats)
  }
  
  openTabs.value.splice(tabIndex, 1)
  
  // Adjust active tab index
  if (openTabs.value.length === 0) {
    // No tabs left - show empty state
    activeTabIndex.value = -1
    gameStore.setGameMode(null)
    activePanel.value = 'explorer'
  } else if (tabIndex <= activeTabIndex.value) {
    // Adjust active index and switch to the new active tab
    activeTabIndex.value = Math.max(0, activeTabIndex.value - 1)
    const newActiveTab = openTabs.value[activeTabIndex.value]
    gameStore.setGameMode(newActiveTab.mode)
  }
  
  // Reset game when closing tabs
  gameStore.resetGame()
}

// Drag and drop handlers
const handleDragStart = (index, event) => {
  draggedTabIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/html', event.target.innerHTML)
  event.target.style.opacity = '0.4'
}

const handleDragEnd = (event) => {
  event.target.style.opacity = '1'
  draggedTabIndex.value = null
  dragOverTabIndex.value = null
}

const handleDragOver = (index, event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  dragOverTabIndex.value = index
}

const handleDragEnter = (index) => {
  dragOverTabIndex.value = index
}

const handleDragLeave = () => {
  dragOverTabIndex.value = null
}

const handleDrop = (index, event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (draggedTabIndex.value === null || draggedTabIndex.value === index) {
    return
  }
  
  // Reorder tabs
  const tabs = [...openTabs.value]
  const draggedTab = tabs[draggedTabIndex.value]
  
  // Remove from old position
  tabs.splice(draggedTabIndex.value, 1)
  
  // Insert at new position
  const newIndex = draggedTabIndex.value < index ? index - 1 : index
  tabs.splice(newIndex, 0, draggedTab)
  
  // Update tabs array
  openTabs.value = tabs
  
  // Update active tab index if needed
  if (activeTabIndex.value === draggedTabIndex.value) {
    activeTabIndex.value = newIndex
  } else if (draggedTabIndex.value < activeTabIndex.value && newIndex >= activeTabIndex.value) {
    activeTabIndex.value--
  } else if (draggedTabIndex.value > activeTabIndex.value && newIndex <= activeTabIndex.value) {
    activeTabIndex.value++
  }
  
  dragOverTabIndex.value = null
}

// Language to file extension mapping
const getLanguageExtension = (language) => {
  const extensionMap = {
    'javascript': 'js',
    'react': 'jsx',
    'typescript': 'ts',
    'python': 'py',
    'css': 'css',
    'sql': 'sql',
    'nodejs': 'js',
    'vue': 'vue',
    'shell': 'sh',
    'go': 'go',
    'rust': 'rs',
    'java': 'java',
    'regex': 'regex'
  }
  return extensionMap[language] || 'txt'
}

// Language to icon mapping
const getLanguageIcon = (language) => {
  const iconMap = {
    'javascript': 'mdi-language-javascript',
    'react': 'mdi-react',
    'typescript': 'mdi-language-typescript',
    'python': 'mdi-language-python',
    'css': 'mdi-language-css3',
    'sql': 'mdi-database',
    'nodejs': 'mdi-nodejs',
    'vue': 'mdi-vuejs',
    'shell': 'mdi-console',
    'go': 'mdi-language-go',
    'rust': 'mdi-language-rust',
    'java': 'mdi-language-java',
    'regex': 'mdi-regex'
  }
  return iconMap[language] || 'mdi-file-code'
}

const getFileNameForMode = (mode) => {
  if (mode === 'free' || mode === 'sprint') {
    // Use settings language preference or current language for dynamic modes
    let language = settingsStore.languagePreference
    if (language === 'all') {
      // When "all" is selected, use the randomly chosen current language
      language = currentLanguage.language
    }
    const extension = getLanguageExtension(language)
    if (mode === 'free') return `FreeCode.${extension}`
    if (mode === 'sprint') return `Sprint10.${extension}`
  }
  
  // Static modes keep their fixed extensions
  const fileMap = {
    'challenge': 'Challenge60s.py',
    'snippets': 'Snippets.md',
    'settings': 'Settings.json',
    'stats': 'Statistics.json',
    'instructions': 'README.md'
  }
  return fileMap[mode] || 'Unknown.txt'
}

const getFileIconForMode = (mode) => {
  if (mode === 'free' || mode === 'sprint') {
    // Use settings language preference or current language for dynamic modes
    let language = settingsStore.languagePreference
    if (language === 'all') {
      // When "all" is selected, use the randomly chosen current language
      language = currentLanguage.language
    }
    return getLanguageIcon(language)
  }
  
  // Static modes keep their fixed icons
  const iconMap = {
    'challenge': 'mdi-language-python',
    'snippets': 'mdi-code-braces',
    'settings': 'mdi-cog',
    'stats': 'mdi-chart-box',
    'instructions': 'mdi-information'
  }
  return iconMap[mode] || 'mdi-file'
}

const closeActiveTab = () => {
  closeTab(activeTabIndex.value)
}

// Click handler for input area
const focusInput = () => {
  if (inputField.value && !isGameOver.value) {
    inputField.value.focus()
  }
}

// Refocus input if it loses focus
const refocusInput = () => {
  if (!isGameOver.value) {
    setTimeout(() => {
      if (inputField.value) {
        inputField.value.focus()
      }
    }, 10)
  }
}

// Auto-focus on any click in the game area
const handleGameClick = (event) => {
  // Don't focus input if clicking on custom dropdown
  if (event.target.closest('.custom-dropdown')) {
    return
  }
  focusInput()
}
// Initialize game on mount
onMounted(() => {
  // Load settings from localStorage
  settingsStore.loadFromLocalStorage()
  
  // Load stats history from localStorage
  statsStore.loadHistoryFromLocalStorage()
  
  // Initialize the game store
  gameStore.initializeGame()
  
  // Start with empty state - no mode set until user opens a tab
  gameStore.gameState = 'waiting'
  gameStore.currentSnippet = ''
  
  // Open instructions by default
  openTab('instructions')
  
  // Save FreeCode stats before page unload
  window.addEventListener('beforeunload', () => {
    if (gameStore.gameMode === 'free' && gameStore.gameState === 'playing' && gameStore.completedLinesCount > 0) {
      const finalStats = statsStore.calculateFinalStats(gameStore.timer, gameStore.completedLinesCount)
      statsStore.saveSession(finalStats)
    }
  })
  
  nextTick(() => {
    focusInput()
    // Handle outside clicks for input focus
    document.addEventListener('click', (e) => {
      // Focus input if not clicking on dropdown or input field
      if (!isGameOver.value && e.target !== inputField.value && !e.target.closest('.custom-dropdown')) {
        setTimeout(() => focusInput(), 10)
      }
    })
  })
})

// Watch for language preference changes
watch(() => settingsStore.languagePreference, (newPref) => {
  if (newPref !== 'all') {
    // When a specific language is selected, update immediately
    currentLanguage.language = newPref
  }
})
</script>

<style scoped>
/* ========== SHARED EDITOR STYLES (ALL MODES) ========== */
/* Default (VS Code Dark) */
:deep(.line-numbers-column) {
  width: 50px;
  background: var(--line-number-bg);
  border-right: 2px solid var(--line-number-border);
  flex-shrink: 0;
  padding: 0;
  overflow: visible;
  position: relative;
}


:deep(.line-number) {
  height: 1.375em;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-right: 1em;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 1em;
  color: var(--vscode-editorLineNumber-foreground);
  user-select: none;
  line-height: 1.375em;
}

:deep(.line-number.active-line) {
  color: var(--vscode-editorLineNumber-activeForeground);
  background: var(--vscode-editor-lineHighlightBackground);
}

:deep(.words-container) {
  flex: 1;
  position: relative;
  background: var(--vscode-editor-background);
  padding: 0;
  padding-left: 1em;
  margin: 0;
  overflow-y: auto;
  min-height: 100%;
  text-align: left;
}

:deep(.word-item) {
  position: absolute;
  left: 1em;
  right: 0;
  height: 1.375em;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 1em;
  line-height: 1.375em;
  padding: 0;
  margin: 0;
  z-index: 2;
  text-align: left;
}

:deep(.current-word-input) {
  width: 100%;
  text-align: left;
  display: block;
}

:deep(.word-text) {
  width: 100%;
  color: var(--vscode-editor-foreground);
  opacity: 0.7;
  text-align: left;
  display: block;
}

:deep(.code-line) {
  display: inline-block;
  width: 100%;
  text-align: left;
}

:deep(.code-char) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 1em;
}

/* Make space dots less visible */
:deep(.code-char.space-char) {
  opacity: 0.25;
}

:deep(.code-char.correct) {
  background-color: var(--success-bg);
  color: var(--success-text);
}

:deep(.code-char.incorrect) {
  background-color: var(--error-bg);
  color: var(--error-text);
  text-decoration: underline wavy var(--error-text);
}

:deep(.code-char.current) {
  background-color: var(--vscode-editorCursor-background);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

:deep(.completion-indicator) {
  color: var(--vscode-testing-iconPassed);
  margin-left: 8px;
  font-weight: bold;
}

:deep(.hidden-input) {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

/* Syntax highlighting */
:deep(.code-char.punctuation) { color: var(--vscode-editor-foreground); }
:deep(.code-char.string) { color: #ce9178; }
:deep(.code-char.number) { color: #b5cea8; }
:deep(.code-char.type) { color: #4ec9b0; }
:deep(.code-char.identifier) { color: #9cdcfe; }
:deep(.code-char.operator) { color: var(--vscode-editor-foreground); }
:deep(.code-char.default) { color: var(--vscode-editor-foreground); }

/* Auto-indented leading spaces - dimmed to show they're not typed */
:deep(.code-char.auto-indent) {
  opacity: 0.4;
  color: var(--text-secondary);
}

/* VS Code Title Bar */
.title-bar {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  padding: 0 12px;
}

.title-bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  flex: 1;
}

.title-bar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.title-bar-right {
  padding: 0;
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* VS Code Layout Styles */
.vscode-layout {
  display: flex;
  height: calc(100vh - 54px); /* 30px title bar + 24px status bar */
  font-family: 'Fira Code', monospace;
}

/* Activity Bar (left sidebar) */
.activity-bar {
  width: 56px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0 48px 0; 
  overflow-y: auto;
  min-height: 0;
}

.activity-icons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.activity-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary);
}

.activity-icon:hover, .activity-icon.active {
  background: var(--bg-secondary);
  color: var(--text-accent);
}

.activity-logo {
  opacity: 0.5;
  cursor: pointer;
  transition: opacity 0.2s;
  position: relative;
  flex-shrink: 0;
  margin-top: 8px;
}

.activity-logo:hover {
  opacity: 1;
}

.activity-logo .active {
  opacity: 1;
  color: var(--highlight) !important;
}

.settings-icon {
  position: relative;
}

.settings-badge {
  position: absolute;
  bottom: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

/* Side Panel */
.side-panel {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.panel-header {
  height: 35px;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}

.panel-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

/* File Tree */
.file-tree {
  padding: 8px 0;
}

.file-item {
  height: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-primary);
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background: var(--bg-tertiary);
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
  margin: 4px 12px;
}

/* Search Panel */
.search-content {
  padding: 12px;
}

.search-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s ease;
}

.search-option:hover {
  background: var(--bg-tertiary);
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
  font-size: 12px;
  color: var(--text-secondary);
}

.search-divider {
  height: 1px;
  background: var(--border-color);
  margin: 8px 12px;
}

/* Git Panel */
.git-content {
  padding: 12px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.stats-section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 16px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-color);
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

/* Snippets Viewer */
.snippets-viewer {
  height: 100%;
  overflow: hidden;
  background: var(--vscode-editor-background);
  text-align: left;
}

.snippets-editor {
  height: 100%;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  background: var(--vscode-editor-background);
  text-align: left;
}

.code-lines {
  padding: 20px 0;
  text-align: left;
}

.code-line {
  display: flex;
  min-height: 1.375em;
  padding: 0;
  color: var(--vscode-editor-foreground);
  text-align: left;
}

.line-number {
  width: 50px;
  padding: 0 1em 0 1em;
  text-align: right;
  color: var(--vscode-editorLineNumber-foreground);
  background: var(--vscode-editorGutter-background);
  user-select: none;
  flex-shrink: 0;
  font-size: 0.75em;
  line-height: 1.375em;
}

.line-content {
  padding: 0 1em;
  white-space: pre;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  line-height: 1.375em;
  text-align: left;
}

.snippets-editor::-webkit-scrollbar {
  width: 12px;
}

.snippets-editor::-webkit-scrollbar-track {
  background: var(--vscode-scrollbar-shadow);
}

.snippets-editor::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 6px;
}

.snippets-editor::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}

/* Bottom Panel */
.bottom-panel {
  height: 200px;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.panel-tabs {
  display: flex;
  gap: 1px;
}

.panel-tab {
  height: 35px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-primary);
  border-top: 2px solid transparent;
}

.panel-tab.active {
  border-top-color: var(--text-accent);
}

.terminal-content {
  flex: 1;
  padding: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  background: var(--bg-primary);
  overflow-y: auto;
}

.terminal-line {
  margin-bottom: 8px;
}

.terminal-prompt {
  color: #4caf50;
  font-weight: 500;
}

.terminal-command {
  color: var(--text-accent);
  margin-left: 8px;
}

.terminal-output {
  margin-left: 16px;
  margin-top: 8px;
}

.stat-output {
  margin-bottom: 6px;
  display: flex;
  gap: 8px;
}

.stat-label {
  color: var(--text-secondary);
  min-width: 80px;
}

.stat-value {
  color: var(--text-primary);
}

.stat-number {
  color: var(--text-accent);
  font-weight: 500;
}

.stat-success {
  color: #4caf50;
  font-weight: 500;
}

.stat-secondary {
  color: var(--text-secondary);
  font-weight: 400;
}

/* Tab Container */
.tab-container {
  display: flex;
  height: 35px;
}

/* Individual File Tabs */
.file-tab {
  background: var(--bg-secondary);
  height: 35px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 12px;
  border-bottom: 2px solid transparent;
  border-right: 1px solid var(--border-color);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: move;
  transition: all 0.2s ease;
  max-width: 180px;
  min-width: 120px;
  position: relative;
}

.file-tab:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.file-tab.active {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-bottom-color: var(--text-accent);
}

.file-tab.drag-over {
  border-left: 3px solid var(--text-accent);
  background: var(--bg-tertiary);
}

.tab-drop-zone {
  min-width: 40px;
  height: 35px;
  transition: all 0.2s ease;
}

.tab-drop-zone.drag-over {
  background: var(--bg-tertiary);
  border-left: 3px solid var(--text-accent);
}

.tab-filename {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Current File Tab - Legacy styles updated */
.current-file-tab {
  background: var(--bg-primary);
  height: 35px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 12px;
  border-top: 2px solid var(--text-accent);
  font-size: 13px;
  color: var(--text-primary);
  position: relative;
  max-width: 200px;
}

.empty-tab {
  background: var(--bg-secondary);
  height: 35px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
}

.empty-text {
  opacity: 0.7;
}

.file-type-icon {
  color: var(--text-accent);
  flex-shrink: 0;
}

.tab-close {
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 3px;
  padding: 2px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0.6;
}

.file-tab:hover .tab-close {
  opacity: 1;
}

.file-tab.active .tab-close {
  opacity: 0.8;
}

.tab-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  opacity: 1 !important;
}

.panel-toggle {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text-secondary);
}

.panel-toggle:hover {
  background: var(--bg-primary);
  color: var(--text-accent);
}

/* Editor Container */
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

/* Tab Bar */
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  height: 35px;
  padding: 0;
}

.tab-left {
  display: flex;
  align-items: center;
  gap: 0;
  height: 100%;
  padding: 0;
}

.tab-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 100%;
}

/* Editor Content */
.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  align-items: stretch;
  justify-content: flex-start;
}

.typing-game-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.input-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  width: 1px;
  height: 1px;
}

/* GitHub Dark Theme */
:global(.theme-github-dark) {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --text-primary: #f0f6fc;
  --text-secondary: #8b949e;
  --text-accent: #58a6ff;
  --border-color: #21262d;
  --highlight-bg: #1c2128;
  --highlight-border: #58a6ff;
  --line-number-bg: #010409;
  --line-number-border: #0d1117;
}

/* Shades of Purple Theme */
:global(.theme-shades-of-purple) {
  --bg-primary: #2d2b55;
  --bg-secondary: #3d3976;
  --bg-tertiary: #4d4796;
  --text-primary: #e3dfff;
  --text-secondary: #a599e9;
  --text-accent: #b362ff;
  --border-color: #4d4796;
  --highlight-bg: #463e7b;
  --highlight-border: #b362ff;
  --line-number-bg: #1f1d3d;
  --line-number-border: #2d2b55;
}
.typing-game {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  background: var(--bg-primary);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.header {    
  text-align: center;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.theme-selector {
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.theme-selector label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-family: 'Fira Code', monospace;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  min-width: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  background: var(--bg-primary);
}

.dropdown-trigger:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: -2px;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  font-size: 0.7rem;
}

.dropdown-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  backdrop-filter: none;
  opacity: 1;
}

.dropdown-item {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: transparent;
  color: var(--text-primary);
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;
  display: block;
}

.dropdown-item:hover {
  background: var(--bg-tertiary);
}

.dropdown-item.selected {
  background: var(--text-accent);
  color: white;
}

.dropdown-item.selected:hover {
  background: var(--text-accent);
  opacity: 0.9;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-accent);
  font-weight: 600;
  letter-spacing: 1px;
  font-family: 'Fira Code', monospace;
}

/* Glitch Logo Styling */
.logo-glitch {
  position: relative;
  display: inline-block;
  font-size: 3rem !important;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0 0 1rem 0;
  text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  animation: glitch 725ms infinite;
}

.logo-text {
  color: var(--text-primary);
}

.logo-accent {
  color: var(--text-accent);
}

.logo-glitch span[aria-hidden="true"] {
  position: absolute;
  top: 0;
  left: 0;
}

.logo-glitch span[aria-hidden="true"]:first-of-type {
  animation: glitch 500ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
}

.logo-glitch span[aria-hidden="true"]:last-of-type {
  animation: glitch 375ms infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(0.04em, 0.03em);
  opacity: 0.75;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  }
  15% {
    text-shadow: 0.05em 0 0 #00fffc, -0.03em -0.04em 0 #fc00ff, 0.025em 0.04em 0 #fffc00;
  }
  16% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00;
  }
  49% {
    text-shadow: -0.05em -0.025em 0 #00fffc, 0.025em 0.035em 0 #fc00ff, -0.05em -0.05em 0 #fffc00;
  }
  50% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00;
  }
  99% {
    text-shadow: 0.05em 0.035em 0 #00fffc, 0.03em 0 0 #fc00ff, 0 -0.04em 0 #fffc00;
  }
  100% {
    text-shadow: -0.05em 0 0 #00fffc, -0.025em -0.04em 0 #fc00ff, -0.04em -0.025em 0 #fffc00;
  }
}

.game-mode-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.mode-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 0;
  border-top: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-family: 'Fira Code', monospace;
  margin: 0 4px;
}

.mode-btn:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.mode-btn.active {
  background: var(--bg-primary);
  color: var(--text-accent);
  border-top-color: var(--text-accent);
}

.stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  font-size: 1.3rem;
}

.stat {
  background: var(--bg-tertiary);
  padding: 0.6rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  font-weight: 500;
  min-width: 100px;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
}

.stat.typing-ready {
  background: var(--text-accent);
  border-color: var(--text-accent);
  color: white;
  animation: pulse-blue 2s infinite;
}

.stat.time-warning {
  background: rgba(244, 67, 54, 0.8);
  border-color: rgba(244, 67, 54, 1);
  color: white;
  animation: pulse-red 1s infinite;
}

.stat.instruction-text {
  background: #2d4a3d;
  border-color: #4caf50;
  color: #81c784;
  font-size: 0.8rem;
  opacity: 0.9;
}

@keyframes pulse-blue {
  0%, 100% { 
    background: #0e639c;
    transform: scale(1);
  }
  50% { 
    background: #1177bb;
    transform: scale(1.02);
  }
}

@keyframes pulse-red {
  0%, 100% { 
    background: rgba(244, 67, 54, 0.4);
    transform: scale(1);
  }
  50% { 
    background: rgba(244, 67, 54, 0.6);
    transform: scale(1.05);
  }
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  z-index: 10;
}

.game-over-content {
  background: var(--bg-secondary);
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}

.game-over-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--text-accent);
  font-family: 'Fira Code', monospace;
}

.final-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 4px;
  min-width: 300px;
  border: 1px solid var(--border-color);
}

.stat-label {
  font-size: 1.1rem;
  color: var(--text-primary);
  font-family: 'Fira Code', monospace;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-accent);
  font-family: 'Fira Code', monospace;
}

.play-again-btn {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--text-accent);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-family: 'Fira Code', monospace;
}

.play-again-btn:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

.word-display {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: var(--bg-primary);
  border: none;
  margin: 0;
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
}

.words-container {
  transition: transform 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  padding: 2rem;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: var(--bg-primary);
  position: relative;
}

.words-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  z-index: 1;
}

.word-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 400;
  transition: all 0.3s ease;
  margin: 0;
  padding: 0 0 0 80px;
  position: relative;
  flex-shrink: 0;
  width: 100%;
  font-size: 16px;
  line-height: 24px;
  background: var(--bg-primary);
}

.word-item::before {
  content: attr(data-line-number);
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  width: 30px;
  text-align: right;
  z-index: 2;
}

.word-item.current-word {
  background: var(--highlight-bg);
  border-left: 3px solid var(--highlight-border);
}

.word-item.completed-word {
  opacity: 0.6;
  background: var(--bg-primary);
}

.word-item.future-word {
  opacity: 0.4;
}

.reset-btn, .toggle-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--text-accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 120px;
  font-family: 'Fira Code', monospace;
}

.reset-btn:hover, .toggle-btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.input-area {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }
  .header h1 {
    font-size: 2rem;
  }
  .stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  .stat {
    min-width: 80px;
    font-size: 0.8rem;
  }
  .words-container {
    padding: 1rem;
  }
  .code-char, .current-word-input {
    font-size: 14px;
  }
  .word-item {
    height: 32px;
    padding-left: 60px;
  }
  .word-item::before {
    left: 10px;
    font-size: 12px;
  }
}

/* Code editor styling */
.current-word-input {
  display: flex;
  align-items: start; 
  justify-content: start; 
  text-align: left;
  font-size: 16px;
  font-weight: 400;
  color: var(--text-primary);
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  line-height: 24px;
  position: relative;
  width: 100%;
}

.code-line {
  display: flex;
  align-items: start;
  justify-content: start; 
  text-align: left;
  line-height: 24px;
  position: relative;
}

.code-char {
  font-size: 16px;
  font-weight: 400;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  transition: all 0.15s ease;
  position: relative;
}

/* Syntax highlighting colors */
.code-char.punctuation { color: var(--text-primary); }
.code-char.string { color: #ce9178; }
.code-char.number { color: #b5cea8; }
.code-char.type { color: #4ec9b0; }
.code-char.identifier { color: #9cdcfe; }
.code-char.operator { color: var(--text-primary); }
.code-char.default { color: var(--text-primary); }

/* Theme-specific syntax highlighting */
:global(.theme-vscode-light) .code-char.string { color: #a31515; }
:global(.theme-vscode-light) .code-char.number { color: #098658; }
:global(.theme-vscode-light) .code-char.type { color: #267f99; }
:global(.theme-vscode-light) .code-char.identifier { color: #001080; }

:global(.theme-dracula) .code-char.string { color: #f1fa8c; }
:global(.theme-dracula) .code-char.number { color: #bd93f9; }
:global(.theme-dracula) .code-char.type { color: #8be9fd; }
:global(.theme-dracula) .code-char.identifier { color: #50fa7b; }

:global(.theme-monokai) .code-char.string { color: #e6db74; }
:global(.theme-monokai) .code-char.number { color: #ae81ff; }
:global(.theme-monokai) .code-char.type { color: #66d9ef; }
:global(.theme-monokai) .code-char.identifier { color: #a6e22e; }

:global(.theme-github-dark) .code-char.string { color: #a5d6ff; }
:global(.theme-github-dark) .code-char.number { color: #79c0ff; }
:global(.theme-github-dark) .code-char.type { color: #7ee787; }
:global(.theme-github-dark) .code-char.identifier { color: #ffa657; }

:global(.theme-shades-of-purple) .code-char.string { color: #f8c555; }
:global(.theme-shades-of-purple) .code-char.number { color: #ff6ac1; }
:global(.theme-shades-of-purple) .code-char.type { color: #9effff; }
:global(.theme-shades-of-purple) .code-char.identifier { color: #fad000; }

.code-char.correct {
  background: rgba(46, 125, 50, 0.3);
  border-radius: 2px;
}

.code-char.incorrect {
  background: rgba(244, 67, 54, 0.3);
  border-radius: 2px;
  animation: code-shake 0.3s ease;
}

.code-char.current {
  background: rgba(86, 156, 214, 0.3);
  border-radius: 2px;
  position: relative;
}

.code-char.current::after {
  content: '|';
  position: absolute;
  right: -1px;
  top: 0;
  color: var(--text-accent);
  animation: cursor-blink 1s infinite;
  font-weight: bold;
}

.completion-indicator {
  color: #4caf50;
  font-weight: bold;
  margin-left: 4px;
  animation: completion-flash 0.5s ease;
}

@keyframes completion-flash {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

@keyframes code-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px); }
  75% { transform: translateX(1px); }
}

/* Non-current words */
.word-text {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--text-secondary);
  line-height: 24px;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  width: 100%;
}

.final-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.input-area {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>
