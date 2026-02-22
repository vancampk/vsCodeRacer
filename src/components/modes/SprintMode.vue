<template>
  <div class="sprint-mode">
    <CodeEditor 
      :words-to-show="wordsToShow"
      :current-word-index="completedLinesCount"
      :current-input="currentInput"
    />
    
    <!-- Hidden Input -->
    <input
      v-model="currentInput"
      @input="handleInput($event)"
      @keydown="handleKeyDown"
      @blur="refocusInput"
      type="text"
      class="hidden-input"
      ref="inputField"
      autocomplete="off"
      spellcheck="false"
      :disabled="isGameOver"
    />
    
    <!-- Progress Indicator -->
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${(completedLinesCount / 10) * 100}%` }"
      ></div>
      <span class="progress-text">{{ completedLinesCount }}/10 lines</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { useStatsStore } from '../../stores/statsStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useCodeLines } from '../../composables/useCodeLines'
import { useCurrentLanguage } from '../../composables/useCurrentLanguage'
import CodeEditor from '../shared/CodeEditor.vue'

// Stores
const gameStore = useGameStore()
const statsStore = useStatsStore()
const settingsStore = useSettingsStore()
const { setCurrentLanguage } = useCurrentLanguage()

// Template refs
const inputField = ref(null)

// Use shared code lines logic (10 lines for sprint, scroll mode)
const { 
  completedLinesCount, 
  currentInput, 
  currentLanguage,
  wordsToShow,
  initializeLines, 
  isLineComplete,
  advanceToNextLine
} = useCodeLines(10, 'scroll', settingsStore.languagePreference, settingsStore.mixedLanguageMode)

// Computed properties
const isGameOver = computed(() => {
  return completedLinesCount.value >= 10
})

// Handle input
const handleInput = (event) => {
  const input = event.target.value
  
  // Resume game if paused (check first)
  if (gameStore.gameState === 'paused') {
    gameStore.resumeGame()
  }
  
  // Start game on first input
  if (gameStore.gameState === 'waiting' && input.length > 0) {
    gameStore.startGame()
  }
  
  // Update stats with current input and target line
  const currentLineIndex = completedLinesCount.value
  const currentLine = wordsToShow.value[currentLineIndex]
  if (currentLine) {
    statsStore.updateStats(input, currentLine.trimmedWord)
  }
  
  currentInput.value = input
}

// Handle key events
const handleKeyDown = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault()
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    // Only advance if the current line is complete
    if (isLineComplete(currentInput.value)) {
      advanceToNextLine()
      // Sync with main game store when line completed
      gameStore.completedLinesCount = completedLinesCount.value
      
      // End game when 10 lines are completed
      if (completedLinesCount.value >= 10) {
        gameStore.finishGame()
        
        // Save session stats
        const finalStats = statsStore.calculateFinalStats(gameStore.timer, completedLinesCount.value)
        statsStore.saveSession(finalStats)
      }
    }
  }
  if (event.key === 'Escape') {
    event.preventDefault()
    if (gameStore.gameState === 'playing') {
      gameStore.pauseGame()
    } else if (gameStore.gameState === 'paused') {
      gameStore.resumeGame()
    }
  }
}

// Focus management
const refocusInput = () => {
  nextTick(() => {
    if (inputField.value && !isGameOver.value) {
      inputField.value.focus()
    }
  })
}

// Lifecycle
onMounted(() => {
  initializeLines()
  nextTick(() => {
    refocusInput()
  })
})

// Watch for language changes and update shared state
watch(currentLanguage, (newLanguage) => {
  setCurrentLanguage(newLanguage)
  console.log('Sprint language changed to:', newLanguage)
}, { immediate: true })

// Focus input when component becomes active
watch(() => gameStore.gameMode, (newMode) => {
  if (newMode === 'sprint') {
    nextTick(() => {
      refocusInput()
    })
  }
})

// Sync currentInput with gameStore.userInput
watch(() => gameStore.userInput, (newValue) => {
  currentInput.value = newValue
})
</script>

<style scoped>
.sprint-mode {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--vscode-progressBar-background);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--vscode-progressBar-foreground);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: var(--vscode-editor-foreground);
  background: var(--vscode-editor-background);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--vscode-widget-border);
}
</style>