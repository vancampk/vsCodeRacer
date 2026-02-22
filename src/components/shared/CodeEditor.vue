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
            <!-- Extra characters typed beyond the expected line -->
            <span 
              v-for="extraIndex in Math.max(0, currentInput.length - wordItem.trimmedWord.length)"
              :key="'extra-' + extraIndex"
              :class="['code-char', 'incorrect', 'extra-char']"
            >
              {{ currentInput[wordItem.trimmedWord.length + extraIndex - 1] === ' ' ? '·' : currentInput[wordItem.trimmedWord.length + extraIndex - 1] }}
            </span>
            <!-- Show completion indicator when word is fully typed correctly -->
            <span v-if="currentInput.length === wordItem.trimmedWord.length && currentInput === wordItem.trimmedWord" class="completion-indicator">
              <span class="enter-icon">⏎</span>
            </span>
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
    'perl': 'PL',
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
  text-align: left;
}

.word-item {
  position: absolute;
  left: 20px;
  right: 20px;
  height: 22px;
  line-height: 22px;
  color: var(--vscode-editor-foreground);
  text-align: left;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
  width: 100%;
  text-align: left;
  display: block;
}

.code-line {
  font-family: var(--vscode-editor-fontFamily);
  font-size: var(--vscode-editor-fontSize);
  white-space: pre;
  text-align: left;
  display: inline-block;
  width: 100%;
}

.code-char {
  position: relative;
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: 1em;
  transition: all 0.15s ease;
}

.code-char.auto-indent {
  color: var(--vscode-editor-lineNumbers-foreground);
}

.code-char.space-char:not(.auto-indent)::before {
  content: '·';
  color: rgba(128, 128, 128, 0.08);
  position: absolute;
}

.code-char.correct {
  background: rgba(46, 125, 50, 0.3);
  color: var(--success-text);
  border-radius: 2px;
}

.code-char.incorrect {
  background: rgba(244, 67, 54, 0.3);
  color: var(--error-text);
  border-radius: 2px;
  animation: code-shake 0.3s ease;
}

.code-char.extra-char {
  background: rgba(244, 67, 54, 0.5);
  text-decoration: underline wavy rgba(244, 67, 54, 0.8);
  text-underline-offset: 2px;
}

.code-char.current {
  background: rgba(86, 156, 214, 0.3);
  border-radius: 2px;
  position: relative;
  animation: blink 1s infinite;
}

.code-char.current::after {
  position: absolute;
  right: -1px;
  top: 0;
  color: var(--text-accent);
  animation: cursor-blink 1s infinite;
  font-weight: bold;
}

.completion-indicator {
  font-weight: bold;
  margin-left: 4px;
  animation: completion-flash 0.5s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.check-mark {
  color: #4caf50;
}

.enter-icon {
  color: #2196f3;
  font-size: 0.9em;
  padding: 2px 4px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 3px;
  border: 1px solid rgba(33, 150, 243, 0.3);
  animation: pulse-enter 1.5s ease-in-out infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
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

@keyframes completion-flash {
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes pulse-enter {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
}

/* Syntax highlighting */
.code-char.punctuation { color: var(--vscode-editor-foreground); }
.code-char.string { color: #ce9178; }
.code-char.number { color: #b5cea8; }
.code-char.type { color: #4ec9b0; }
.code-char.identifier { color: #9cdcfe; }
.code-char.operator { color: var(--vscode-editor-foreground); }
.code-char.default { color: var(--vscode-editor-foreground); }

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
</style>