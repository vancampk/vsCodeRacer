import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CODE_SNIPPETS } from '../data/codeSnippets.js'
import { useStatsStore } from './statsStore.js'

export const useGameStore = defineStore('game', () => {
  // Game state
  const gameState = ref('waiting') // 'waiting', 'playing', 'paused', 'finished'
  const gameMode = ref('sprint') // 'free', 'sprint', 'challenge'
  const currentSnippet = ref('')
  const userInput = ref('')
  const currentLine = ref(0)
  const cursorPosition = ref(0)
  const startTime = ref(null)
  const endTime = ref(null)
  const timer = ref(0)
  const timerInterval = ref(null)
  const resetCounter = ref(0) // Increments on each reset
  const completedLinesCount = ref(0) // Track total completed lines
  
  // Game modes configuration
  const gameModes = ref([
    { value: 'free', name: 'Free Code', description: 'Practice at your own pace' },
    { value: 'sprint', name: '10 Line Sprint', description: 'Complete 10 lines as fast as possible' },
    { value: 'challenge', name: '60s Challenge', description: 'How many lines in 60 seconds?' },
    { value: 'snippets', name: 'All Snippets', description: 'Browse and practice all code snippets' }
  ])
  
  // Computed properties
  const currentText = computed(() => currentSnippet.value.split('\n')[currentLine.value] || '')
  
  const isGameActive = computed(() => gameState.value === 'playing')
  
  const completedLines = computed(() => {
    // For free mode, use the persistent counter
    // For other modes, use currentLine progress + persistent counter from previous sessions
    return completedLinesCount.value + (gameMode.value === 'free' ? 0 : currentLine.value)
  })
  
  const totalLines = computed(() => {
    if (gameMode.value === 'sprint') return 10
    return currentSnippet.value.split('\n').length
  })
  
  const isLineComplete = computed(() => {
    const currentLineText = currentText.value
    return userInput.value === currentLineText
  })
  
  // Actions
  const initializeGame = () => {
    resetGame()
    generateSnippet()
  }
  
  const resetGame = () => {
    gameState.value = 'waiting'
    userInput.value = ''
    currentLine.value = 0
    cursorPosition.value = 0
    startTime.value = null
    endTime.value = null
    timer.value = 0
    clearInterval(timerInterval.value)
    completedLinesCount.value = 0
    resetCounter.value++ // Increment to trigger watchers
  }
  
  const startGame = () => {
    if (gameState.value !== 'waiting' && gameState.value !== 'paused') return
    
    gameState.value = 'playing'
    startTime.value = new Date()
    
    // Start timer
    timerInterval.value = setInterval(() => {
      timer.value = Math.floor((new Date() - startTime.value) / 1000)
      
      // Check 60s challenge timeout
      if (gameMode.value === 'challenge' && timer.value >= 60) {
        finishGame()
      }
    }, 1000)
  }
  
  const pauseGame = () => {
    if (gameState.value === 'playing') {
      gameState.value = 'paused'
      clearInterval(timerInterval.value)
      
      // Save stats in FreeCode mode when pausing (since it never "finishes")
      if (gameMode.value === 'free' && completedLinesCount.value > 0) {
        const statsStore = useStatsStore()
        const finalStats = statsStore.calculateFinalStats(timer.value, completedLinesCount.value)
        statsStore.saveSession(finalStats)
      }
    } else if (gameState.value === 'paused') {
      resumeGame()
    }
  }
  
  const resumeGame = () => {
    if (gameState.value !== 'paused') return
    
    gameState.value = 'playing'
    // Adjust start time to account for elapsed time
    const elapsedMs = timer.value * 1000
    startTime.value = new Date(Date.now() - elapsedMs)
    
    // Restart timer
    timerInterval.value = setInterval(() => {
      timer.value = Math.floor((new Date() - startTime.value) / 1000)
      
      // Check 60s challenge timeout
      if (gameMode.value === 'challenge' && timer.value >= 60) {
        finishGame()
      }
    }, 1000)
  }
  
  const finishGame = () => {
    gameState.value = 'finished'
    endTime.value = new Date()
    clearInterval(timerInterval.value)
  }
  
  const generateSnippet = () => {
    if (gameMode.value === 'sprint') {
      // Generate exactly 10 lines for sprint mode
      const lines = []
      while (lines.length < 10) {
        const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
        const snippetLines = randomSnippet.split('\n').filter(line => line.trim())
        lines.push(...snippetLines.slice(0, 10 - lines.length))
      }
      currentSnippet.value = lines.slice(0, 10).join('\n')
    } else if (gameMode.value === 'snippets') {
      // For snippets mode, show ALL snippets in organized sections
      let display = '# 📚 CodeRacer - Complete Snippets Library\n\n'
      display += '// Browse through 400+ real code examples\n'
      display += '// Perfect for learning different coding patterns and syntax\n'
      display += '// Scroll down to explore all available code snippets\n\n'
      display += '═'.repeat(60) + '\n\n'
      
      // Group snippets by estimated language/framework
      const jsSnippets = []
      const vueSnippets = []
      const reactSnippets = []
      const pythonSnippets = []
      const otherSnippets = []
      
      CODE_SNIPPETS.forEach((snippet, index) => {
        const lower = snippet.toLowerCase()
        if (lower.includes('vue') || lower.includes('<template>') || lower.includes('defineComponent')) {
          vueSnippets.push({ snippet, index: index + 1 })
        } else if (lower.includes('react') || lower.includes('usestate') || lower.includes('jsx')) {
          reactSnippets.push({ snippet, index: index + 1 })
        } else if (lower.includes('def ') || lower.includes('import ') || lower.includes('python')) {
          pythonSnippets.push({ snippet, index: index + 1 })
        } else if (lower.includes('const ') || lower.includes('function') || lower.includes('console.log')) {
          jsSnippets.push({ snippet, index: index + 1 })
        } else {
          otherSnippets.push({ snippet, index: index + 1 })
        }
      })
      
      // Display sections
      const addSection = (title, snippets) => {
        if (snippets.length > 0) {
          display += `## ${title} (${snippets.length} snippets)\n\n`
          snippets.forEach(({ snippet, index }) => {
            display += `### Snippet ${index}:\n`
            display += '```\n' + snippet + '\n```\n\n'
          })
          display += '\n' + '─'.repeat(50) + '\n\n'
        }
      }
      
      addSection('🟨 JavaScript', jsSnippets)
      addSection('💚 Vue.js', vueSnippets)
      addSection('🔵 React', reactSnippets)
      addSection('🐍 Python', pythonSnippets)
      addSection('🌐 Other Languages', otherSnippets)
      
      display += `\n\n📊 **Library Statistics:**\n`
      display += `• Total Snippets: ${CODE_SNIPPETS.length}\n`
      display += `• JavaScript: ${jsSnippets.length}\n`
      display += `• Vue.js: ${vueSnippets.length}\n`
      display += `• React: ${reactSnippets.length}\n`
      display += `• Python: ${pythonSnippets.length}\n`
      display += `• Other: ${otherSnippets.length}\n\n`
      display += `🎯 Ready to practice? Switch to other modes to start typing!`
      
      currentSnippet.value = display
    } else {
      // Free and Challenge modes - fill all visible lines with random snippets
      if (gameMode.value === 'free') {
        // Generate 50 lines of random snippets for continuous scrolling
        const lines = []
        while (lines.length < 50) {
          const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
          lines.push(randomSnippet)
        }
        currentSnippet.value = lines.join('\n')
      } else {
        // Challenge mode - single random snippet
        const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
        currentSnippet.value = randomSnippet
      }
    }
  }
  
  const processInput = (input) => {
    if (gameState.value !== 'playing' && gameState.value !== 'waiting') return
    
    // Start game on first input
    if (gameState.value === 'waiting' && input.length > 0) {
      startGame()
    }
    
    userInput.value = input
    
    // Check for line completion
    if (isLineComplete.value) {
      moveToNextLine()
    }
    
    // Update cursor position
    cursorPosition.value = input.length
  }
  
  const moveToNextLine = () => {
    const lines = currentSnippet.value.split('\n')
    
    // Always increment completed lines counter when a line is finished
    completedLinesCount.value++
    
    if (gameMode.value === 'free') {
      // For free mode: remove first line and add new random line at the end
      lines.shift() // Remove the completed line
      const newSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)]
      lines.push(newSnippet) // Add new line at the end
      currentSnippet.value = lines.join('\n')
      // Keep currentLine at 0 for continuous flow
      currentLine.value = 0
      userInput.value = ''
      cursorPosition.value = 0
    } else {
      // Other modes: normal line progression
      if (currentLine.value < lines.length - 1) {
        currentLine.value++
        userInput.value = ''
        cursorPosition.value = 0
        
        // Check if game should finish
        if (gameMode.value === 'sprint' && completedLinesCount.value >= 10) {
          finishGame()
        }
      } else {
        finishGame()
      }
    }
  }
  
  const setGameMode = (mode) => {
    const newMode = mode || 'free'
    gameMode.value = newMode
    
    // Generate snippet for all valid game modes
    if (newMode === 'free' || newMode === 'sprint' || newMode === 'challenge' || newMode === 'snippets') {
      generateSnippet()
      if (newMode !== 'snippets') {
        resetGame()
      }
    } else {
      currentSnippet.value = ''
      resetGame()
    }
  }
  
  return {
    // State
    gameState,
    gameMode,
    currentSnippet,
    userInput,
    currentLine,
    cursorPosition,
    startTime,
    endTime,
    timer,
    gameModes,
    resetCounter,
    completedLinesCount,
    
    // Computed
    currentText,
    isGameActive,
    completedLines,
    totalLines,
    isLineComplete,
    
    // Actions
    initializeGame,
    resetGame,
    startGame,
    pauseGame,
    resumeGame,
    finishGame,
    generateSnippet,
    processInput,
    moveToNextLine,
    setGameMode
  }
})