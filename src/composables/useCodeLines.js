import { ref, computed } from 'vue'
import { JAVASCRIPT_BLOCKS } from '../data/blocks/javascriptBlocks.js'
import { REACT_BLOCKS } from '../data/blocks/reactBlocks.js'
import { TYPESCRIPT_BLOCKS } from '../data/blocks/typescriptBlocks.js'
import { PYTHON_BLOCKS } from '../data/blocks/pythonBlocks.js'
import { CSS_BLOCKS } from '../data/blocks/cssBlocks.js'
import { SQL_BLOCKS } from '../data/blocks/sqlBlocks.js'
import { NODEJS_BLOCKS } from '../data/blocks/nodejsBlocks.js'
import { VUE_BLOCKS } from '../data/blocks/vueBlocks.js'
import { SHELL_BLOCKS } from '../data/blocks/shellBlocks.js'
import { GO_BLOCKS } from '../data/blocks/goBlocks.js'
import { RUST_BLOCKS } from '../data/blocks/rustBlocks.js'
import { JAVA_BLOCKS } from '../data/blocks/javaBlocks.js'
import { REGEX_BLOCKS } from '../data/blocks/regexBlocks.js'

const LANGUAGE_BLOCKS = {
  javascript: JAVASCRIPT_BLOCKS,
  react: REACT_BLOCKS,
  typescript: TYPESCRIPT_BLOCKS,
  python: PYTHON_BLOCKS,
  css: CSS_BLOCKS,
  sql: SQL_BLOCKS,
  nodejs: NODEJS_BLOCKS,
  vue: VUE_BLOCKS,
  shell: SHELL_BLOCKS,
  go: GO_BLOCKS,
  rust: RUST_BLOCKS,
  java: JAVA_BLOCKS,
  regex: REGEX_BLOCKS
}

const ALL_LANGUAGES = Object.keys(LANGUAGE_BLOCKS)

export function useCodeLines(initialCount = 50, mode = 'shift', languagePreference = 'all', mixedLanguageMode = false) {
  // Local state
  const codeLines = ref([])
  const completedLinesCount = ref(0)
  const currentInput = ref('')
  const currentLanguage = ref('javascript')
  const currentLineLanguages = ref([]) // Track language for each line in mixed mode

  // Get blocks for the specified language or random if 'all'
  const getBlocksForLanguage = (language) => {
    if (language === 'all') {
      const randomLanguage = ALL_LANGUAGES[Math.floor(Math.random() * ALL_LANGUAGES.length)]
      currentLanguage.value = randomLanguage
      return LANGUAGE_BLOCKS[randomLanguage]
    } else {
      currentLanguage.value = language
      return LANGUAGE_BLOCKS[language] || LANGUAGE_BLOCKS.javascript
    }
  }

  // Get a random line from any language block (for mixed mode)
  const getRandomLineFromAnyLanguage = () => {
    let attempts = 0
    const maxAttempts = 50 // Prevent infinite loops
    
    while (attempts < maxAttempts) {
      const randomLanguage = ALL_LANGUAGES[Math.floor(Math.random() * ALL_LANGUAGES.length)]
      const blocks = LANGUAGE_BLOCKS[randomLanguage]
      const randomBlock = blocks[Math.floor(Math.random() * blocks.length)]
      const blockLines = randomBlock.split('\n')
      const randomLine = blockLines[Math.floor(Math.random() * blockLines.length)]
      
      // In mixed mode, skip blank lines and lines that are only whitespace
      const trimmedLine = randomLine.trimStart()
      if (trimmedLine.length > 0) {
        return { line: randomLine, language: randomLanguage }
      }
      
      attempts++
    }
    
    // Fallback if we can't find a non-blank line (shouldn't happen)
    return { line: 'console.log("Hello World");', language: 'javascript' }
  }

  // Initialize with random code blocks
  const initializeLines = () => {
    const lines = []
    const lineLanguages = []
    const targetCount = mode === 'shift' ? Math.max(initialCount, 60) : initialCount
    
    console.log('initializeLines - mode:', mode, 'initialCount:', initialCount, 'targetCount:', targetCount, 'mixedLanguageMode:', mixedLanguageMode)
    
    if (mixedLanguageMode) {
      // Mixed language mode: get random lines from different languages
      for (let i = 0; i < targetCount; i++) {
        const randomLineData = getRandomLineFromAnyLanguage()
        // Strip leading spaces in mixed mode for cleaner appearance
        const cleanLine = randomLineData.line.trimStart()
        lines.push(cleanLine)
        lineLanguages.push(randomLineData.language)
      }
      currentLineLanguages.value = lineLanguages
      currentLanguage.value = 'mixed'
    } else {
      // Regular mode: get blocks for the current language preference
      const blocks = getBlocksForLanguage(languagePreference)
      
      // Keep adding blocks until we have enough lines
      while (lines.length < targetCount) {
        const randomBlock = blocks[Math.floor(Math.random() * blocks.length)]
        const blockLines = randomBlock.split('\n')
        lines.push(...blockLines)
        // Fill language tracking array for consistency
        for (let i = 0; i < blockLines.length; i++) {
          lineLanguages.push(currentLanguage.value)
        }
      }
      currentLineLanguages.value = lineLanguages.slice(0, targetCount)
    }
    
    // Trim to exact target count
    codeLines.value = lines.slice(0, targetCount)
    currentLineLanguages.value = currentLineLanguages.value.slice(0, targetCount)
    console.log('initializeLines - created lines:', lines.length, 'codeLines.value:', codeLines.value.length, 'language:', currentLanguage.value)
    completedLinesCount.value = 0
    currentInput.value = ''
    
    // Auto-skip any leading blank lines
    skipBlankLines()
  }

  // Computed: words to show in the editor (current + context)
  const wordsToShow = computed(() => {
    if (mode === 'shift') {
      // Shift mode: show all available lines (no limit)
      return codeLines.value.map((line, index) => {
        // In mixed language mode, don't preserve leading spaces
        const leadingSpaces = mixedLanguageMode ? '' : line.match(/^(\s*)/)[0]
        const trimmedLine = line.trimStart()
        const displayLine = mixedLanguageMode ? trimmedLine : line
        return {
          word: displayLine,
          trimmedWord: trimmedLine,
          leadingSpaces: leadingSpaces,
          originalIndex: index,
          displayIndex: index,
          language: currentLineLanguages.value[index] || currentLanguage.value
        }
      })
    } else {
      // Scroll mode: show all lines (for sprint)
      return codeLines.value.map((line, index) => {
        // In mixed language mode, don't preserve leading spaces
        const leadingSpaces = mixedLanguageMode ? '' : line.match(/^(\s*)/)[0]
        const trimmedLine = line.trimStart()
        const displayLine = mixedLanguageMode ? trimmedLine : line
        return {
          word: displayLine,
          trimmedWord: trimmedLine,
          leadingSpaces: leadingSpaces,
          originalIndex: index,
          displayIndex: index,
          language: currentLineLanguages.value[index] || currentLanguage.value
        }
      })
    }
  })

  // Skip blank lines automatically
  const skipBlankLines = () => {
    const currentLineIndex = mode === 'shift' ? 0 : completedLinesCount.value
    
    // Keep skipping while current line is blank
    while (currentLineIndex < codeLines.value.length) {
      const currentLine = codeLines.value[currentLineIndex]
      const trimmedLine = currentLine.trimStart()
      
      if (trimmedLine === '' || trimmedLine.length === 0) {
        if (mode === 'shift') {
          codeLines.value.shift()
          currentLineLanguages.value.shift()
          
          if (mixedLanguageMode) {
            const randomLineData = getRandomLineFromAnyLanguage()
            // Strip leading spaces in mixed mode
            const cleanLine = randomLineData.line.trimStart()
            codeLines.value.push(cleanLine)
            currentLineLanguages.value.push(randomLineData.language)
          } else {
            const blocks = getBlocksForLanguage(languagePreference)
            const randomBlock = blocks[Math.floor(Math.random() * blocks.length)]
            const blockLines = randomBlock.split('\n')
            codeLines.value.push(...blockLines)
            for (let i = 0; i < blockLines.length; i++) {
              currentLineLanguages.value.push(currentLanguage.value)
            }
          }
          completedLinesCount.value++
        } else {
          completedLinesCount.value++
          if (completedLinesCount.value >= codeLines.value.length) break
        }
      } else {
        break // Stop when we find a non-blank line
      }
    }
  }

  // Check if current line is complete
  const checkLineComplete = (input) => {
    const currentLineIndex = mode === 'shift' ? 0 : completedLinesCount.value
    const currentLine = codeLines.value[currentLineIndex]
    const trimmedLine = currentLine.trimStart()
    
    if (input === trimmedLine) {
      if (mode === 'shift') {
        // Shift mode: remove first line and add new line
        codeLines.value.shift()
        currentLineLanguages.value.shift()
        
        if (mixedLanguageMode) {
          const randomLineData = getRandomLineFromAnyLanguage()
          // Strip leading spaces in mixed mode
          const cleanLine = randomLineData.line.trimStart()
          codeLines.value.push(cleanLine)
          currentLineLanguages.value.push(randomLineData.language)
        } else {
          // Add a new block's worth of lines using the current language
          const blocks = getBlocksForLanguage(languagePreference)
          const randomBlock = blocks[Math.floor(Math.random() * blocks.length)]
          const blockLines = randomBlock.split('\n')
          codeLines.value.push(...blockLines)
          for (let i = 0; i < blockLines.length; i++) {
            currentLineLanguages.value.push(currentLanguage.value)
          }
        }
        
        completedLinesCount.value++
      } else {
        // Scroll mode: move to next line
        completedLinesCount.value++
      }
      currentInput.value = ''
      
      // Auto-skip any blank lines after completing this line
      skipBlankLines()
      
      return true
    }
    return false
  }

  return {
    codeLines,
    completedLinesCount,
    currentInput,
    currentLanguage,
    currentLineLanguages,
    wordsToShow,
    initializeLines,
    checkLineComplete
  }
}
