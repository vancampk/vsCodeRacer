import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Theme settings
  const selectedTheme = ref('vscode-dark')
  
  const themes = ref([
    { value: 'vscode-dark', name: 'VS Code Dark' },
    { value: 'vscode-light', name: 'VS Code Light' },
    { value: 'dracula', name: 'Dracula' },
    { value: 'monokai', name: 'Monokai' },
    { value: 'github-dark', name: 'GitHub Dark' },
    { value: 'shades-of-purple', name: 'Shades of Purple' }
  ])
  
  // User preferences
  const soundEnabled = ref(true)
  const showLineNumbers = ref(true)
  const focusMode = ref(false)
  const autoStartGame = ref(false)
  const languagePreference = ref('all')
  const mixedLanguageMode = ref(false)
  
  // Computed
  const currentTheme = computed(() => {
    return themes.value.find(theme => theme.value === selectedTheme.value)
  })
  
  const getThemeDisplayName = computed(() => {
    return currentTheme.value ? currentTheme.value.name : 'VS Code Dark'
  })
  
  // Actions
  const setTheme = (themeValue) => {
    selectedTheme.value = themeValue
    applyTheme()
    saveToLocalStorage()
  }
  
  const applyTheme = () => {
    document.documentElement.className = `theme-${selectedTheme.value}`
  }
  
  const toggleSetting = (setting) => {
    switch (setting) {
      case 'sound':
        soundEnabled.value = !soundEnabled.value
        break
      case 'lineNumbers':
        showLineNumbers.value = !showLineNumbers.value
        break
      case 'focusMode':
        focusMode.value = !focusMode.value
        break
      case 'autoStart':
        autoStartGame.value = !autoStartGame.value
        break
      case 'mixedLanguage':
        mixedLanguageMode.value = !mixedLanguageMode.value
        break
    }
    saveToLocalStorage()
  }
  
  const saveToLocalStorage = () => {
    const settings = {
      selectedTheme: selectedTheme.value,
      soundEnabled: soundEnabled.value,
      showLineNumbers: showLineNumbers.value,
      focusMode: focusMode.value,
      autoStartGame: autoStartGame.value,
      mixedLanguageMode: mixedLanguageMode.value
    }
    localStorage.setItem('coderacer-settings', JSON.stringify(settings))
  }
  
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('coderacer-settings')
    if (saved) {
      try {
        const settings = JSON.parse(saved)
        selectedTheme.value = settings.selectedTheme || 'vscode-dark'
        soundEnabled.value = settings.soundEnabled !== undefined ? settings.soundEnabled : true
        showLineNumbers.value = settings.showLineNumbers !== undefined ? settings.showLineNumbers : true
        focusMode.value = settings.focusMode !== undefined ? settings.focusMode : false
        autoStartGame.value = settings.autoStartGame !== undefined ? settings.autoStartGame : false
        mixedLanguageMode.value = settings.mixedLanguageMode !== undefined ? settings.mixedLanguageMode : false
        applyTheme()
      } catch (e) {
        console.warn('Failed to load settings from localStorage:', e)
      }
    }
  }
  
  const resetSettings = () => {
    selectedTheme.value = 'vscode-dark'
    soundEnabled.value = true
    showLineNumbers.value = true
    focusMode.value = false
    autoStartGame.value = false
    languagePreference.value = 'all'
    mixedLanguageMode.value = false
    applyTheme()
    saveToLocalStorage()
  }
  
  return {
    // State
    selectedTheme,
    themes,
    soundEnabled,
    showLineNumbers,
    focusMode,
    autoStartGame,
    languagePreference,
    mixedLanguageMode,
    
    // Computed
    currentTheme,
    getThemeDisplayName,
    theme: selectedTheme,
    
    // Actions
    setTheme,
    applyTheme,
    toggleSetting,
    saveToLocalStorage,
    loadFromLocalStorage,
    resetSettings
  }
})