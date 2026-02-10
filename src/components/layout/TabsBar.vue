<template>
  <div class="tab-bar">
    <div class="tab-left">
      <!-- Multiple Tabs -->
      <div class="tab-container">
        <div 
          v-for="(tab, index) in processedTabs" 
          :key="tab.id"
          class="file-tab"
          :class="{ 
            active: activeTabIndex === index,
            'drag-over': dragOverTabIndex === index && draggedTabIndex !== index
          }"
          draggable="true"
          @dragstart="$emit('drag-start', index, $event)"
          @dragend="$emit('drag-end', $event)"
          @dragover="$emit('drag-over', index, $event)"
          @dragenter="$emit('drag-enter', index)"
          @dragleave="$emit('drag-leave')"
          @drop="$emit('drop', index, $event)"
          @click="$emit('switch-tab', index)"
        >
          <v-icon size="16" class="file-type-icon">{{ tab.icon }}</v-icon>
          <span class="tab-filename">{{ tab.filename }}</span>
          <v-icon 
            size="14" 
            class="tab-close" 
            @click.stop="$emit('close-tab', index)"
          >mdi-close</v-icon>
        </div>
        <!-- Drop zone at the end -->
        <div 
          v-if="openTabs.length > 0"
          class="tab-drop-zone"
          :class="{ 'drag-over': dragOverTabIndex === openTabs.length }"
          @dragover="$emit('drag-over', openTabs.length, $event)"
          @dragenter="$emit('drag-enter', openTabs.length)"
          @dragleave="$emit('drag-leave')"
          @drop="$emit('drop', openTabs.length, $event)"
        ></div>
      </div>
      
      <!-- Empty state when no tabs -->
      <div class="empty-tab" v-if="openTabs.length === 0">
        <span class="empty-text">No file open</span>
      </div>
    </div>
    <div class="tab-actions">
      <v-icon size="16" class="panel-toggle" @click="$emit('toggle-bottom-panel')">mdi-console</v-icon>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '../../stores/settingsStore.js'
import { useCurrentLanguage } from '../../composables/useCurrentLanguage.js'

const props = defineProps({
  openTabs: {
    type: Array,
    default: () => []
  },
  activeTabIndex: {
    type: Number,
    default: -1
  },
  draggedTabIndex: {
    type: Number,
    default: null
  },
  dragOverTabIndex: {
    type: Number,
    default: null
  }
})

defineEmits([
  'drag-start',
  'drag-end', 
  'drag-over',
  'drag-enter',
  'drag-leave',
  'drop',
  'switch-tab',
  'close-tab',
  'toggle-bottom-panel'
])

const settingsStore = useSettingsStore()
const { currentLanguage } = useCurrentLanguage()

// Helper functions
const getLanguageIcon = (lang) => {
  const iconMap = {
    'javascript': 'mdi-language-javascript',
    'python': 'mdi-language-python',
    'typescript': 'mdi-language-typescript',
    'java': 'mdi-language-java',
    'react': 'mdi-react',
    'vue': 'mdi-vuejs',
    'nodejs': 'mdi-nodejs',
    'go': 'mdi-language-go',
    'rust': 'mdi-language-rust',
    'css': 'mdi-language-css3',
    'shell': 'mdi-console',
    'sql': 'mdi-database',
    'regex': 'mdi-regex'
  }
  return iconMap[lang] || 'mdi-code-braces'
}

const getLanguageExtension = (lang) => {
  const extMap = {
    'javascript': 'js',
    'python': 'py',
    'typescript': 'ts',
    'java': 'java',
    'react': 'jsx',
    'vue': 'vue',
    'nodejs': 'js',
    'go': 'go',
    'rust': 'rs',
    'css': 'css',
    'shell': 'sh',
    'sql': 'sql',
    'regex': 'regex'
  }
  return extMap[lang] || 'txt'
}

const getFileNameForMode = (mode) => {
  const language = settingsStore.languagePreference === 'all' 
    ? currentLanguage.language 
    : settingsStore.languagePreference
  const ext = getLanguageExtension(language)
  
  const fileMap = {
    'free': `FreeCode.${ext}`,
    'sprint': `Sprint10.${ext}`,
    'challenge': 'Challenge60s.py',
    'snippets': 'Snippets.md',
    'settings': 'Settings.json',
    'stats': 'Stats.json',
    'instructions': 'README.md'
  }
  return fileMap[mode] || 'Unknown.txt'
}

const getFileIconForMode = (mode) => {
  if (mode === 'free' || mode === 'sprint') {
    let language = settingsStore.languagePreference
    if (language === 'all') {
      language = currentLanguage.language
    }
    return getLanguageIcon(language)
  }
  
  const iconMap = {
    'challenge': 'mdi-language-python',
    'snippets': 'mdi-code-braces',
    'settings': 'mdi-cog',
    'stats': 'mdi-chart-box',
    'instructions': 'mdi-information'
  }
  return iconMap[mode] || 'mdi-file'
}

// Process tabs to add icon and filename
const processedTabs = computed(() => {
  return props.openTabs.map(tab => ({
    ...tab,
    icon: getFileIconForMode(tab.mode),
    filename: getFileNameForMode(tab.mode)
  }))
})
</script>

<style scoped>
.tab-bar {
  height: 35px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  font-size: 13px;
}

.tab-left {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
}

.tab-container {
  display: flex;
  flex: 1;
}

.file-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 35px;
  padding: 0 12px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
  transition: background 0.15s ease;
  position: relative;
}

.file-tab:hover {
  background: var(--bg-secondary);
}

.file-tab.active {
  background: var(--bg-primary);
  border-bottom-color: var(--text-accent);
}

.file-tab.drag-over {
  background: var(--highlight-bg);
}

.file-type-icon {
  flex-shrink: 0;
}

.tab-filename {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.tab-close {
  opacity: 0;
  flex-shrink: 0;
  padding: 2px;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.tab-close:hover {
  background: var(--bg-tertiary);
}

.file-tab:hover .tab-close,
.file-tab.active .tab-close {
  opacity: 1;
}

.tab-drop-zone {
  width: 40px;
  flex-shrink: 0;
  transition: background 0.15s ease;
}

.tab-drop-zone.drag-over {
  background: var(--highlight-bg);
}

.empty-tab {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--bg-primary);
}

.empty-text {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 12px;
}

.tab-actions {
  display: flex;
  align-items: center;
  padding: 0 8px;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-color);
}

.panel-toggle {
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  border-radius: 3px;
  transition: all 0.15s ease;
}

.panel-toggle:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.tab-left::-webkit-scrollbar {
  height: 3px;
}

.tab-left::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

.tab-left::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
}
</style>
