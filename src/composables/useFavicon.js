import { watch } from 'vue'

export function useFavicon() {
  const themeColors = {
    'vscode-dark': {
      bg: '#1e1e1e',
      accent: '#569cd6',
      slash: '#4ec9b0'
    },
    'vscode-light': {
      bg: '#ffffff',
      accent: '#0066cc',
      slash: '#388e3c'
    },
    'dracula': {
      bg: '#282a36',
      accent: '#bd93f9',
      slash: '#50fa7b'
    },
    'monokai': {
      bg: '#272822',
      accent: '#66d9ef',
      slash: '#a6e22e'
    },
    'github-dark': {
      bg: '#0d1117',
      accent: '#58a6ff',
      slash: '#3fb950'
    },
    'shades-of-purple': {
      bg: '#2d2b55',
      accent: '#b362ff',
      slash: '#80ffbb'
    }
  }

  const updateFavicon = (theme) => {
    const colors = themeColors[theme] || themeColors['vscode-dark']
    
    // Create SVG with theme colors
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="${colors.bg}"/>
        <path d="M8.5 8L5 12l3.5 4" stroke="${colors.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.5 8L19 12l-3.5 4" stroke="${colors.accent}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13 6l-2 12" stroke="${colors.slash}" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `.trim()

    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    // Update favicon
    let link = document.querySelector("link[rel*='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    
    // Revoke old URL if it exists
    if (link.href.startsWith('blob:')) {
      URL.revokeObjectURL(link.href)
    }
    
    link.href = url
  }

  const setupFaviconWatcher = (settingsStore) => {
    // Set initial favicon
    updateFavicon(settingsStore.selectedTheme)
    
    // Watch for theme changes
    watch(
      () => settingsStore.selectedTheme,
      (newTheme) => {
        updateFavicon(newTheme)
      }
    )
  }

  return {
    updateFavicon,
    setupFaviconWatcher
  }
}
