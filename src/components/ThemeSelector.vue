<template>
  <div class="theme-selector">
    <label>Theme:</label>
    <div class="custom-dropdown" :class="{ 'dropdown-open': dropdownOpen }">
      <button 
        @click.stop="toggleDropdown" 
        class="dropdown-trigger"
        type="button"
      >
        {{ getThemeDisplayName(selectedTheme) }}
        <span class="dropdown-arrow">▼</span>
      </button>
      <div v-if="dropdownOpen" class="dropdown-menu">
        <button 
          v-for="theme in themes" 
          :key="theme.value"
          @click.stop="selectTheme(theme.value)"
          :class="['dropdown-item', { 'selected': selectedTheme === theme.value }]"
          type="button"
        >
          {{ theme.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'


const props = defineProps({
  selectedTheme: {
    type: String,
    default: 'vscode-dark'
  }
})


const emit = defineEmits(['themeChanged'])

// Local state
const dropdownOpen = ref(false)

// Theme options
const themes = [
  { value: 'vscode-dark', name: 'VS Code Dark' },
  { value: 'vscode-light', name: 'VS Code Light' },
  { value: 'dracula', name: 'Dracula' },
  { value: 'monokai', name: 'Monokai' },
  { value: 'github-dark', name: 'GitHub Dark' },
  { value: 'shades-of-purple', name: 'Shades of Purple' }
]

// Methods
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectTheme = (theme) => {
  dropdownOpen.value = false
  emit('themeChanged', theme)
}

const getThemeDisplayName = (themeValue) => {
  const theme = themes.find(t => t.value === themeValue)
  return theme ? theme.name : 'VS Code Dark'
}

const closeDropdownOnOutsideClick = (event) => {
  if (!event.target.closest('.custom-dropdown')) {
    dropdownOpen.value = false
  }
}

// Setup outside click listener
onMounted(() => {
  nextTick(() => {
    document.addEventListener('click', closeDropdownOnOutsideClick)
  })
})
</script>

<style scoped>
.theme-selector {
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.theme-selector label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-family: 'Fira Code', monospace;
}

.custom-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  cursor: pointer;
  min-width: 140px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  background: var(--bg-primary);
}

.dropdown-trigger:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: -2px;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  font-size: 0.7rem;
}

.dropdown-open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  margin-top: 2px;
  max-height: 200px;
  overflow-y: auto;
  backdrop-filter: none;
  opacity: 1;
}

.dropdown-item {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: transparent;
  color: var(--text-primary);
  border: none;
  text-align: left;
  cursor: pointer;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;
  display: block;
}

.dropdown-item:hover {
  background: var(--bg-tertiary);
}

.dropdown-item.selected {
  background: var(--text-accent);
  color: white;
}

.dropdown-item.selected:hover {
  background: var(--text-accent);
  opacity: 0.9;
}
</style>