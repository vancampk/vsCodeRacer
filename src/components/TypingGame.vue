<template>
  <v-app class="typing-game" @click="handleGameClick">
    <!-- VS Code Title Bar -->
    <TitleBar @save-and-reset="saveAndReset" />
    
    <div class="vscode-layout">
      <!-- Activity Bar (left side) -->
      <ActivityBar 
        :active-panel="activePanel"
        :game-mode="gameMode"
        @toggle-panel="togglePanel"
        @open-tab="openTab"
      />
      
      <!-- Side Panel -->
      <SidePanel 
        :active-panel="activePanel"
        :instructions-open="instructionsOpen"
        :accuracy="accuracy"
        :loc-per-minute="locPerMinute"
        :time-elapsed="timeElapsed"
        :words-completed="wordsCompleted"
        @close="activePanel = null"
        @update:instructions-open="instructionsOpen = $event"
        @open-tab="openTab"
      />
      
      <!-- Main Editor Area -->
      <div class="editor-container">
        <!-- Tab Bar -->
        <TabsBar
          :open-tabs="openTabs"
          :active-tab-index="activeTabIndex"
          :dragged-tab-index="draggedTabIndex"
          :drag-over-tab-index="dragOverTabIndex"
          @drag-start="handleDragStart"
          @drag-end="handleDragEnd"
          @drag-over="handleDragOver"
          @drag-enter="handleDragEnter"
          @drag-leave="handleDragLeave"
          @drop="handleDrop"
          @switch-tab="switchToTab"
          @close-tab="closeTab"
          @toggle-bottom-panel="showBottomPanel = !showBottomPanel"
        />
        
        <!-- Editor Content -->
        <EditorArea
          :has-open-tabs="openTabs.length > 0"
          :show-bottom-panel="showBottomPanel"
          :current-w-p-m="locPerMinute"
          :accuracy="accuracy"
          :lines-completed="wordsCompleted"
          :time-elapsed="gameStore.timer"
          :game-mode="gameMode"
          :average-wpm="statsStore.averageWPM"
          @open-explorer="togglePanel('explorer')"
          @close-bottom-panel="showBottomPanel = false"
        >
          <!-- Stats Panel in Main Editor -->
          <StatsPanel v-if="gameMode === 'stats'" @close="closeActiveTab" />
          
          <!-- Settings Panel in Main Editor -->
          <SettingsPanel v-if="gameMode === 'settings'" @close="closeActiveTab" />
          
          <!-- Instructions Panel in Main Editor -->
          <InstructionsPanel v-if="gameMode === 'instructions'" @close="closeActiveTab" />
          
          <!-- Snippets Viewer in Main Editor -->
          <SnippetsViewer v-if="gameMode === 'snippets'" @close="closeActiveTab" />
          
          <!-- Game Modes -->
          <FreeCodeMode v-if="gameMode === 'free'" />
          <SprintMode v-if="gameMode === 'sprint'" />
          <ChallengeMode v-if="gameMode === 'challenge'" />
        </EditorArea>
        
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

// Layout components
import TitleBar from './layout/TitleBar.vue'
import ActivityBar from './layout/ActivityBar.vue'
import SidePanel from './layout/SidePanel.vue'
import TabsBar from './layout/TabsBar.vue'
import EditorArea from './layout/EditorArea.vue'

// UI components
import StatsBar from './StatsBar.vue'
import GameOverOverlay from './GameOverOverlay.vue'
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
const instructionsOpen = ref(false)
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
/* VS Code Layout Styles */
.vscode-layout {
  display: flex;
  flex: 1;
  font-family: 'Fira Code', monospace;
  overflow: hidden;
  min-height: 0;
}

/* Editor Container */
.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  min-width: 0;
  min-height: 0;
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
  position: relative;
  overflow: hidden;
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
</style>
