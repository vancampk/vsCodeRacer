import { reactive } from 'vue'

// Shared reactive state for current language
export const currentLanguageState = reactive({
  language: 'javascript'
})

export function useCurrentLanguage() {
  const setCurrentLanguage = (language) => {
    currentLanguageState.language = language
    console.log('Language updated to:', language)
  }

  const getCurrentLanguage = () => {
    return currentLanguageState.language
  }

  return {
    currentLanguage: currentLanguageState,
    setCurrentLanguage,
    getCurrentLanguage
  }
}