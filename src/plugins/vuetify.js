import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

// VS Code inspired theme that complements your IDE themes
const vsCodeTheme = {
  dark: {
    colors: {
      primary: '#007ACC',      // VS Code blue
      secondary: '#569CD6',    // Light blue
      accent: '#C586C0',       // Purple
      error: '#F44747',        // Red
      warning: '#FFCC02',      // Yellow
      info: '#75BEFF',         // Light blue
      success: '#4EC9B0',      // Teal
      background: '#1E1E1E',   // Dark background
      surface: '#252526',      // Surface color
      'surface-variant': '#2D2D30',
      'on-surface': '#CCCCCC',
      'on-primary': '#FFFFFF',
    }
  },
  light: {
    colors: {
      primary: '#0078D4',
      secondary: '#106EBE',
      accent: '#881798',
      error: '#D13438',
      warning: '#F9A825',
      info: '#2196F3',
      success: '#00C851',
      background: '#FFFFFF',
      surface: '#F8F8F8',
      'surface-variant': '#EEEEEE',
      'on-surface': '#1E1E1E',
      'on-primary': '#FFFFFF',
    }
  }
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: vsCodeTheme
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  },
  defaults: {
    VCard: {
      elevation: 1,
      variant: 'outlined'
    },
    VBtn: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VChip: {
      size: 'small',
      variant: 'outlined'
    }
  }
})