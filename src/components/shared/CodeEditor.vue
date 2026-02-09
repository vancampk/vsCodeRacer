<template>
  <div class="code-editor">
    <!-- Line Numbers Column -->
    <div class="line-numbers-column" ref="lineNumbersColumn">
      <div 
        v-for="lineNum in visibleLineNumbers" 
        :key="lineNum"
        class="line-number"
        :class="{ 'active-line': lineNum === currentWordIndex + 1 }"
      >
        {{ lineNum }}
        <!-- Language indicator for mixed mode -->
        <span 
          v-if="showLanguageIndicators && getLanguageForLine(lineNum - 1)"
          class="language-indicator"
          :title="getLanguageForLine(lineNum - 1)"
        >
          {{ getLanguageAbbreviation(getLanguageForLine(lineNum - 1)) }}
        </span>
      </div>
    </div>
    
    <!-- Content Area -->
    <div class="words-container">
      <div 
        v-for="wordItem in displayWords" 
        :key="wordItem.originalIndex"
        :class="[
          'word-item',
          {
            'current-word': wordItem.originalIndex === currentWordIndex,
            'completed-word': wordItem.originalIndex < currentWordIndex,
            'future-word': wordItem.originalIndex > currentWordIndex
          }
        ]"
        :style="{ top: `${wordItem.originalIndex * 22}px` }"
      >
        <!-- Current word with code editor styling -->
        <div v-if="wordItem.originalIndex === currentWordIndex" class="current-word-input">
          <span class="code-line">
            <!-- Leading spaces (auto-indented, not typed) -->
            <span 
              v-for="(letter, letterIndex) in wordItem.leadingSpaces"
              :key="'space-' + letterIndex"
              :class="['code-char', 'auto-indent']"
            >
              {{ letter === ' ' ? '·' : letter }}
            </span>
            <!-- Actual typeable characters -->
            <span 
              v-for="(letter, letterIndex) in wordItem.trimmedWord"
              :key="letterIndex"
              :class="[
                'code-char',
                { 'space-char': letter === ' ' },
                getCodeCharType(letter),
                {
                  'correct': letterIndex < currentInput.length && currentInput[letterIndex] === letter,
                  'incorrect': letterIndex < currentInput.length && currentInput[letterIndex] !== letter,
                  'current': letterIndex === currentInput.length && letterIndex < wordItem.trimmedWord.length
                }
              ]"
            >
              {{ letterIndex < currentInput.length ? (currentInput[letterIndex] === ' ' ? '·' : currentInput[letterIndex]) : (letter === ' ' ? '·' : letter) }}
            </span>
            <!-- Show completion indicator when word is fully typed correctly -->
            <span v-if="currentInput.length === wordItem.trimmedWord.length && currentInput === wordItem.trimmedWord" class="completion-indicator">✓</span>
          </span>
        </div>
        <!-- Other words (non-current) -->
        <div v-else class="word-text">
          <span 
            v-for="(letter, letterIndex) in wordItem.word"
            :key="letterIndex"
            :class="[
              'code-char',
              { 'space-char': letter === ' ' },
              getCodeCharType(letter)
            ]"
          >
            {{ letter === ' ' ? '·' : letter }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore'

// Settings store
const settingsStore = useSettingsStore()


const props = defineProps({
  wordsToShow: {
    type: Array,
    required: true
  },
  currentWordIndex: {
    type: Number,
    default: 0
  },
  currentInput: {
    type: String,
    default: ''
  }
})

// Show language indicators only when mixed language mode is active
const showLanguageIndicators = computed(() => {
  return settingsStore.mixedLanguageMode
})

// Get language for a specific line index
const getLanguageForLine = (lineIndex) => {
  const wordItem = props.wordsToShow[lineIndex]
  return wordItem?.language
}

// Get language abbreviation for display
const getLanguageAbbreviation = (language) => {
  const abbreviations = {
    'javascript': 'JS',
    'typescript': 'TS', 
    'react': 'RX',
    'vue': 'VU',
    'python': 'PY',
    'css': 'CS',
    'sql': 'SQ',
    'nodejs': 'ND',
    'shell': 'SH',
    'go': 'GO',
    'rust': 'RS',
    'java': 'JV',
    'regex': 'RG'
  }
  return abbreviations[language] || language?.slice(0, 2).toUpperCase()
}

// Template ref for the line numbers column
const lineNumbersColumn = ref(null)
const containerHeight = ref(800) // Start with larger default

// Calculate how many lines can fit in the container
const maxVisibleLines = computed(() => {
  const lineHeight = 22 // 1.375em in pixels at base 16px
  const padding = 40 // Account for padding/margins
  const availableHeight = containerHeight.value - padding
  const calculated = Math.floor(availableHeight / lineHeight)
  console.log('Container height:', containerHeight.value, 'Max lines:', calculated)
  return Math.max(30, calculated) // Ensure at least 30 lines
})

// Calculate visible line numbers based on container height
const visibleLineNumbers = computed(() => {
  const startLine = props.wordsToShow.length > 0 ? props.wordsToShow[0].originalIndex + 1 : 1
  return Array.from({ length: maxVisibleLines.value }, (_, i) => startLine + i)
})

// Limit words to show based on container capacity
const displayWords = computed(() => {
  const sliced = props.wordsToShow.slice(0, maxVisibleLines.value)
  console.log('wordsToShow length:', props.wordsToShow.length, 'displayWords length:', sliced.length, 'maxVisibleLines:', maxVisibleLines.value)
  return sliced
})

// Update container height when mounted and on resize
onMounted(() => {
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
  
  // Also update after a short delay to ensure layout is complete
  setTimeout(updateContainerHeight, 100)
  setTimeout(updateContainerHeight, 500)
})

const updateContainerHeight = () => {
  nextTick(() => {
    if (lineNumbersColumn.value) {
      const parentContainer = lineNumbersColumn.value.closest('.code-editor')
      if (parentContainer) {
        const height = parentContainer.offsetHeight
        if (height > 0) {
          containerHeight.value = height
          console.log('Updated container height:', height)
        }
      }
    }
  })
}

// Get code character type for syntax highlighting
const getCodeCharType = (char) => {
  if (/[{}();,]/.test(char)) return 'punctuation'
  if (/['"`]/.test(char)) return 'string'
  if (/[0-9]/.test(char)) return 'number'
  if (/[A-Z]/.test(char)) return 'type'
  if (/[a-z_$]/.test(char)) return 'identifier'
  if (/[+\-*/<>=!&|]/.test(char)) return 'operator'
  return 'default'
}
</script>

<style scoped>
.code-editor {
  height: 100%;
  display: flex;
  background: var(--vscode-editor-background);
  border: none;  
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
}

.line-numbers-column {
  background: var(--vscode-editor-background);
  padding: 20px 0;
  border-right: 1px solid var(--vscode-editor-lineNumbers-foreground);
  display: flex;
  flex-direction: column;
  min-width: 60px;
  position: relative;
}

.line-number {
  height: 22px;
  line-height: 22px;
  padding: 0 12px 0 8px;
  color: var(--vscode-editor-lineNumbers-foreground);
  font-size: 14px;
  text-align: right;
  user-select: none;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.line-number.active-line {
  color: var(--vscode-editor-lineNumbers-activeForeground);
  background-color: var(--vscode-editor-lineNumbers-activeBg);
}

.language-indicator {
  font-size: 9px;
  background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground);
  padding: 1px 3px;
  border-radius: 2px;
  margin-left: 4px;
  font-weight: 600;
  line-height: 1;
  min-width: 18px;
  text-align: center;
}

.words-container {
  flex: 1;
  position: relative;
  padding: 20px;
  overflow: hidden;
}

.word-item {
  position: absolute;
  left: 20px;
  right: 20px;
  height: 22px;
  line-height: 22px;
  color: var(--vscode-editor-foreground);
}

.current-word {
  background-color: var(--vscode-editor-selectionBackground);
}

.completed-word {
  opacity: 0.6;
}

.future-word {
  opacity: 0.8;
}

.current-word-input {
  position: relative;
}

.code-line {
  font-family: var(--vscode-editor-fontFamily);
  font-size: var(--vscode-editor-fontSize);
  white-space: pre;
}

.code-char {
  position: relative;
}

.code-char.auto-indent {
  color: var(--vscode-editor-lineNumbers-foreground);
}

.code-char.space-char:not(.auto-indent)::before {
  content: '·';
  color: var(--vscode-editor-lineNumbers-foreground);
  position: absolute;
}

.code-char.correct {
  background-color: var(--vscode-editor-selectionBackground);
  color: var(--vscode-editor-foreground);
}

.code-char.incorrect {
  background-color: var(--vscode-errorForeground);
  color: white;
}

.code-char.pending {
  background-color: var(--vscode-editor-cursor-background);
  color: var(--vscode-editor-foreground);
}

/* Syntax highlighting */
.code-char.punctuation { color: var(--vscode-editor-punctuation); }
.code-char.string { color: var(--vscode-editor-string); }
.code-char.number { color: var(--vscode-editor-number); }
.code-char.type { color: var(--vscode-editor-type); }
.code-char.identifier { color: var(--vscode-editor-identifier); }
.code-char.operator { color: var(--vscode-editor-operator); }
.code-char.default { color: var(--vscode-editor-foreground); }
</style>