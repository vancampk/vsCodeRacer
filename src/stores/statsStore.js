import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStatsStore = defineStore('stats', () => {
  // Statistics state
  const totalCharacters = ref(0)
  const correctCharacters = ref(0)
  const mistypedCharacters = ref(0)
  const totalKeystrokes = ref(0)
  const wordsCompleted = ref(0)
  
  // Session history (last 10 sessions)
  const sessionHistory = ref([])
  const maxHistorySize = 10
  
  // Last game stats
  const lastGameStats = ref(null)
  
  // Lifetime totals
  const lifetimeLinesCompleted = ref(0)
  const lifetimeTotalTime = ref(0)
  const lifetimeTotalCharacters = ref(0)
  const lifetimeCorrectCharacters = ref(0)
  
  // Best scores
  const bestWPM = ref(0)
  const bestAccuracy = ref(0)
  const bestLOCPerMinute = ref(0)
  const totalSessionsPlayed = ref(0)
  
  // Computed statistics
  const accuracy = computed(() => {
    if (totalKeystrokes.value === 0) return 0
    return Math.round((correctCharacters.value / totalKeystrokes.value) * 100)
  })
  
  const wpm = computed(() => {
    // We'll calculate this based on passed time and words
    return 0 // Calculated in components
  })
  
  const locPerMinute = computed(() => {
    // We'll calculate this based on passed time and lines
    return 0 // Calculated in components
  })
  
  const charactersPerSecond = computed(() => {
    // We'll calculate this based on passed time
    return 0 // Calculated in components
  })
  
  // Rolling averages from session history
  const averageWPM = computed(() => {
    if (sessionHistory.value.length === 0) return 0
    const sum = sessionHistory.value.reduce((acc, session) => acc + session.wpm, 0)
    return Math.round(sum / sessionHistory.value.length)
  })
  
  const averageAccuracy = computed(() => {
    if (sessionHistory.value.length === 0) return 0
    const sum = sessionHistory.value.reduce((acc, session) => acc + session.accuracy, 0)
    return Math.round(sum / sessionHistory.value.length)
  })
  
  const averageLOCPerMinute = computed(() => {
    if (sessionHistory.value.length === 0) return 0
    const sum = sessionHistory.value.reduce((acc, session) => acc + session.locPerMinute, 0)
    return Math.round(sum / sessionHistory.value.length)
  })
  
  // Consistency score (lower standard deviation = more consistent)
  const consistencyScore = computed(() => {
    if (sessionHistory.value.length < 2) return 100
    const wpms = sessionHistory.value.map(s => s.wpm)
    const avg = averageWPM.value
    const variance = wpms.reduce((acc, wpm) => acc + Math.pow(wpm - avg, 2), 0) / wpms.length
    const stdDev = Math.sqrt(variance)
    // Convert to a 0-100 score (lower deviation = higher score)
    const consistencyPercent = Math.max(0, 100 - (stdDev / avg * 100))
    return Math.round(consistencyPercent)
  })
  
  // All-time stats
  const lifetimeAccuracy = computed(() => {
    if (lifetimeTotalCharacters.value === 0) return 0
    return Math.round((lifetimeCorrectCharacters.value / lifetimeTotalCharacters.value) * 100)
  })
  
  const lifetimeAverageLOCPerMinute = computed(() => {
    if (lifetimeTotalTime.value === 0 || lifetimeLinesCompleted.value === 0) return 0
    const minutes = lifetimeTotalTime.value / 60
    return Math.round(lifetimeLinesCompleted.value / minutes)
  })
  
  // Actions
  const updateStats = (input, targetText) => {
    totalKeystrokes.value++
    
    const inputLength = input.length
    const targetLength = targetText.length
    
    let correct = 0
    let incorrect = 0
    
    for (let i = 0; i < Math.max(inputLength, targetLength); i++) {
      const inputChar = input[i] || ''
      const targetChar = targetText[i] || ''
      
      if (i < inputLength) {
        if (inputChar === targetChar) {
          correct++
        } else {
          incorrect++
        }
      }
    }
    
    correctCharacters.value = correct
    mistypedCharacters.value = incorrect
    totalCharacters.value = inputLength
    
    // Update word count (approximate)
    const words = input.split(/\s+/).filter(word => word.length > 0)
    wordsCompleted.value = words.length
  }
  
  const calculateWPM = (timeInSeconds, linesCompleted) => {
    if (timeInSeconds === 0) return 0
    const minutes = timeInSeconds / 60
    // Estimate words from lines (average 8-10 words per line of code)
    const estimatedWords = linesCompleted * 8
    return Math.round(estimatedWords / minutes)
  }
  
  const calculateLOCPerMinute = (timeInSeconds, linesCompleted) => {
    if (timeInSeconds === 0) return 0
    const minutes = timeInSeconds / 60
    return Math.round(linesCompleted / minutes)
  }
  
  const resetStats = () => {
    totalCharacters.value = 0
    correctCharacters.value = 0
    mistypedCharacters.value = 0
    totalKeystrokes.value = 0
    wordsCompleted.value = 0
  }
  
  const calculateFinalStats = (timer, completedLines) => {
    const totalTime = timer
    const totalLines = completedLines
    
    return {
      wpm: calculateWPM(totalTime, totalLines),
      accuracy: accuracy.value,
      linesCompleted: totalLines,
      timeElapsed: totalTime,
      locPerMinute: calculateLOCPerMinute(totalTime, totalLines),
      charactersPerSecond: totalTime > 0 ? Math.round(correctCharacters.value / totalTime) : 0,
      totalCharacters: totalCharacters.value,
      correctCharacters: correctCharacters.value,
      mistypedCharacters: mistypedCharacters.value
    }
  }
  
  // Save session to history
  const saveSession = (sessionStats) => {
    const session = {
      timestamp: Date.now(),
      wpm: sessionStats.wpm,
      accuracy: sessionStats.accuracy,
      locPerMinute: sessionStats.locPerMinute,
      linesCompleted: sessionStats.linesCompleted,
      timeElapsed: sessionStats.timeElapsed,
      totalCharacters: sessionStats.totalCharacters || 0,
      correctCharacters: sessionStats.correctCharacters || 0
    }
    
    // Save as last game
    lastGameStats.value = session
    
    // Update lifetime totals
    lifetimeLinesCompleted.value += session.linesCompleted
    lifetimeTotalTime.value += session.timeElapsed
    lifetimeTotalCharacters.value += session.totalCharacters
    lifetimeCorrectCharacters.value += session.correctCharacters
    
    // Add to history (keep only last N sessions)
    sessionHistory.value.unshift(session)
    if (sessionHistory.value.length > maxHistorySize) {
      sessionHistory.value = sessionHistory.value.slice(0, maxHistorySize)
    }
    
    // Update best scores
    if (sessionStats.wpm > bestWPM.value) {
      bestWPM.value = sessionStats.wpm
    }
    if (sessionStats.accuracy > bestAccuracy.value) {
      bestAccuracy.value = sessionStats.accuracy
    }
    if (sessionStats.locPerMinute > bestLOCPerMinute.value) {
      bestLOCPerMinute.value = sessionStats.locPerMinute
    }
    
    totalSessionsPlayed.value++
    
    // Save to localStorage
    saveHistoryToLocalStorage()
  }
  
  // LocalStorage management
  const saveHistoryToLocalStorage = () => {
    const data = {
      sessionHistory: sessionHistory.value,
      lastGameStats: lastGameStats.value,
      bestWPM: bestWPM.value,
      bestAccuracy: bestAccuracy.value,
      bestLOCPerMinute: bestLOCPerMinute.value,
      totalSessionsPlayed: totalSessionsPlayed.value,
      lifetimeLinesCompleted: lifetimeLinesCompleted.value,
      lifetimeTotalTime: lifetimeTotalTime.value,
      lifetimeTotalCharacters: lifetimeTotalCharacters.value,
      lifetimeCorrectCharacters: lifetimeCorrectCharacters.value
    }
    localStorage.setItem('coderacer-stats-history', JSON.stringify(data))
  }
  
  const loadHistoryFromLocalStorage = () => {
    const saved = localStorage.getItem('coderacer-stats-history')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        sessionHistory.value = data.sessionHistory || []
        lastGameStats.value = data.lastGameStats || null
        bestWPM.value = data.bestWPM || 0
        bestAccuracy.value = data.bestAccuracy || 0
        bestLOCPerMinute.value = data.bestLOCPerMinute || 0
        totalSessionsPlayed.value = data.totalSessionsPlayed || 0
        lifetimeLinesCompleted.value = data.lifetimeLinesCompleted || 0
        lifetimeTotalTime.value = data.lifetimeTotalTime || 0
        lifetimeTotalCharacters.value = data.lifetimeTotalCharacters || 0
        lifetimeCorrectCharacters.value = data.lifetimeCorrectCharacters || 0
      } catch (e) {
        console.warn('Failed to load stats history:', e)
      }
    }
  }
  
  return {
    // State
    totalCharacters,
    correctCharacters,
    mistypedCharacters,
    totalKeystrokes,
    wordsCompleted,
    sessionHistory,
    lastGameStats,
    bestWPM,
    bestAccuracy,
    bestLOCPerMinute,
    totalSessionsPlayed,
    lifetimeLinesCompleted,
    lifetimeTotalTime,
    lifetimeTotalCharacters,
    lifetimeCorrectCharacters,
    
    // Computed
    accuracy,
    wpm,
    locPerMinute,
    charactersPerSecond,
    averageWPM,
    averageAccuracy,
    averageLOCPerMinute,
    consistencyScore,
    lifetimeAccuracy,
    lifetimeAverageLOCPerMinute,
    
    // Actions
    updateStats,
    resetStats,
    calculateFinalStats,
    calculateWPM,
    calculateLOCPerMinute,
    saveSession,
    loadHistoryFromLocalStorage
  }
})