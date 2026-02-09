<template>
  <div class="settings-panel">
    <div class="settings-header">
      <h3>Settings</h3>
      <v-icon size="20" @click="$emit('close')">mdi-close</v-icon>
    </div>
    
    <div class="settings-content">
      <!-- Theme Selector -->
      <div class="setting-item">
        <label class="setting-label">Theme</label>
        <select 
          v-model="settingsStore.theme" 
          @change="settingsStore.setTheme(settingsStore.theme)"
          class="setting-select"
        >
          <option value="vscode-dark">VS Code Dark</option>
          <option value="vscode-light">VS Code Light</option>
          <option value="dracula">Dracula</option>
          <option value="github-dark">GitHub Dark</option>
          <option value="shades-of-purple">Shades of Purple</option>
        </select>
      </div>
      
      <!-- Language Preference -->
      <div class="setting-item">
        <label class="setting-label">Language Preference</label>
        <select 
          v-model="settingsStore.languagePreference"
          class="setting-select"
        >
          <option value="all">All Languages</option>
          <option value="css">CSS</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
          <option value="nodejs">Node.js/Express</option>
          <option value="python">Python</option>
          <option value="react">React</option>
          <option value="regex">Regex</option>
          <option value="rust">Rust</option>
          <option value="shell">Shell/Git/Docker</option>
          <option value="sql">SQL</option>
          <option value="typescript">TypeScript</option>
          <option value="vue">Vue</option>
        </select>
      </div>
      
      <!-- Mixed Language Mode -->
      <div class="setting-item">
        <label class="setting-label">Mixed Language Mode</label>
        <div class="setting-toggle-with-description">
          <div class="setting-toggle">
            <input 
              type="checkbox" 
              :checked="settingsStore.mixedLanguageMode"
              @change="settingsStore.toggleSetting('mixedLanguage')"
              class="toggle-checkbox"
              id="mixedLanguage"
            />
            <label for="mixedLanguage" class="toggle-label">
              <span class="toggle-text">{{ settingsStore.mixedLanguageMode ? 'On' : 'Off' }}</span>
            </label>
          </div>
          <p class="setting-description inline">
            When enabled, each line will be randomly selected from different programming languages to increase typing challenge
          </p>
        </div>
      </div>
      
      <!-- Clear Data Button -->
      <div class="setting-item">
        <button @click="clearData" class="clear-data-btn">
          <v-icon size="18">mdi-delete-outline</v-icon>
          Clear All Saved Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../stores/settingsStore'

const settingsStore = useSettingsStore()

const clearData = () => {
  if (confirm('Are you sure you want to clear all saved data? This will reset your stats and preferences.')) {
    localStorage.clear()
    location.reload()
  }
}
</script>

<style scoped>
.settings-panel {
  background: var(--bg-primary);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  padding: 0 0 24px 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 32px;
}

.settings-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.settings-header v-icon {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.settings-header v-icon:hover {
  opacity: 1;
}

.settings-content {
  width: 100%;
  max-width: 600px;
}

.setting-item {
  margin-bottom: 32px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
}

.setting-select {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: 15px;
  font-family: 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.setting-select:hover {
  border-color: var(--highlight);
  background: var(--bg-tertiary);
}

.setting-select:focus {
  outline: none;
  border-color: var(--highlight);
  box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
}

.setting-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-toggle-with-description {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.toggle-checkbox {
  display: none;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-label::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: var(--text-secondary);
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle-checkbox:checked + .toggle-label {
  background: var(--highlight);
  border-color: var(--highlight);
}

.toggle-checkbox:checked + .toggle-label::before {
  left: 33px;
  background: white;
}

.toggle-text {
  position: absolute;
  top: 50%;
  left: 70px;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.setting-description {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.setting-description.inline {
  margin-top: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.5;
}

.clear-data-btn {
  width: 100%;
  padding: 14px 20px;
  background: transparent;
  color: var(--error-text);
  border: 2px solid var(--error-text);
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s;
  margin-top: 16px;
}

.clear-data-btn:hover {
  background: var(--error-text);
  color: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.clear-data-btn:active {
  transform: translateY(0);
}
</style>
