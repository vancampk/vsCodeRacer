<template>
  <div class="challenge-mode">
    <CodeEditor 
      :words-to-show="wordsToShow"
      :current-word-index="0"
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
    
    <!-- Timer Display -->
    <div class="timer-display">
      <div class="timer-circle" :class="{ 'warning': timeRemaining <= 10 }">
        <span class="timer-text">{{ timeRemaining }}s</span>
      </div>
      <div class="lines-completed">
        <span>{{ completedLinesCount }} lines completed</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useGameStore } from '../../stores/gameStore'
import { useStatsStore } from '../../stores/statsStore'
import { useCodeLines } from '../../composables/useCodeLines'
import CodeEditor from '../shared/CodeEditor.vue'

const gameStore = useGameStore()
const statsStore = useStatsStore()

// Template refs
const inputField = ref(null)

// Use shared code lines logic (100 lines for challenge mode, shift mode)
const { 
  codeLines, 
  completedLinesCount, 
  currentInput, 
  wordsToShow,
  initializeLines, 
  checkLineComplete 
} = useCodeLines(100, 'shift', settingsStore.languagePreference, settingsStore.mixedLanguageMode)

// Computed properties
const isGameOver = computed(() => {
  return gameStore.gameState === 'finished'
})

const timeRemaining = computed(() => {
  return Math.max(0, 60 - gameStore.timer)
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
  const currentLineIndex = 0 // Always line 0 in shift mode
  const currentLine = wordsToShow.value[currentLineIndex]
  if (currentLine) {
    statsStore.updateStats(input, currentLine.trimmedWord)
  }
  
  currentInput.value = input
  
  // Check if line is complete and sync with game store
  const wasCompleted = checkLineComplete(input)
  if (wasCompleted) {
    // Update main game store with the completed line count
    gameStore.completedLinesCount = completedLinesCount.value
  }
  
  // End game when time runs out
  if (timeRemaining.value === 0 && gameStore.gameState === 'playing') {
    gameStore.finishGame()
    
    // Save session stats
    const finalStats = statsStore.calculateFinalStats(gameStore.timer, completedLinesCount.value)
    statsStore.saveSession(finalStats)
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

// Focus input when component becomes active
watch(() => gameStore.gameMode, (newMode) => {
  if (newMode === 'challenge') {
    nextTick(() => {
      refocusInput()
    })
  }
})

// End game when timer reaches 60 seconds
watch(() => timeRemaining.value, (remaining) => {
  if (remaining === 0 && gameStore.gameState === 'playing') {
    gameStore.finishGame()
    
    // Save session stats
    const finalStats = statsStore.calculateFinalStats(gameStore.timer, completedLinesCount.value)
    statsStore.saveSession(finalStats)
  }
})
</script>

<style scoped>
.challenge-mode {
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

.timer-display {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.timer-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--vscode-button-background);
  border: 2px solid var(--vscode-button-border);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timer-circle.warning {
  background: var(--vscode-errorForeground);
  border-color: var(--vscode-errorForeground);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.timer-text {
  font-size: 14px;
  font-weight: bold;
  color: var(--vscode-button-foreground);
}

.timer-circle.warning .timer-text {
  color: white;
}

.lines-completed {
  font-size: 12px;
  color: var(--vscode-editor-foreground);
  background: var(--vscode-editor-background);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--vscode-widget-border);
  white-space: nowrap;
}
</style>