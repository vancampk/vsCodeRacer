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

/* VS Code Layout Styles */
.vscode-layout {
  display: flex;
  flex: 1;
  font-family: 'Fira Code', monospace;
  overflow: hidden;
  min-height: 0;
}

/* Snippets Viewer */
.snippets-viewer {
  height: 100%;
  overflow: hidden;
  background: var(--vscode-editor-background);
  text-align: left;
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

/* Scrollbar styling for editor content */
.editor-content::-webkit-scrollbar,
.terminal-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.editor-content::-webkit-scrollbar-track,
.terminal-content::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.editor-content::-webkit-scrollbar-thumb,
.terminal-content::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 5px;
}

.editor-content::-webkit-scrollbar-thumb:hover,
.terminal-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-color);
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
