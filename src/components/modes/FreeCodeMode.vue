<template>
  <div class="free-code-mode">
    <CodeEditor 
      :words-to-show="wordsToShow"
      :current-word-index="0"
      :current-input="currentInput"
    />
    
    <!-- Hidden Input -->
    <input
      v-model="currentInput"
      @input="handleInput"
      @keydown="handleKeyDown"
      @blur="refocusInput"
      type="text"
      class="hidden-input"
      ref="inputField"
      autocomplete="off"
      spellcheck="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
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

// Use shared code lines logic (shift mode - always stay on line 1)
const { 
  completedLinesCount, 
  currentInput, 
  currentLanguage,
  wordsToShow,
  initializeLines, 
  checkLineComplete 
} = useCodeLines(50, 'shift', settingsStore.languagePreference, settingsStore.mixedLanguageMode)

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
  const currentLineIndex = 0 // Always line 0 in shift mode
  const currentLine = wordsToShow.value[currentLineIndex]
  if (currentLine) {
    statsStore.updateStats(input, currentLine.trimmedWord)
  }
  
  currentInput.value = input
  
  // Check for line completion and sync with game store
  const wasCompleted = checkLineComplete(input)
  if (wasCompleted) {
    // Update main game store with the completed line count
    gameStore.completedLinesCount = completedLinesCount.value
  }
}

// Handle key events
const handleKeyDown = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault()
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
    if (inputField.value) {
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
  console.log('FreeCode language changed to:', newLanguage)
}, { immediate: true })

// Focus input when component becomes active
watch(() => gameStore.gameMode, (newMode) => {
  if (newMode === 'free') {
    nextTick(() => {
      refocusInput()
    })
  }
})
</script>

<style scoped>
.free-code-mode {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
}
</style>