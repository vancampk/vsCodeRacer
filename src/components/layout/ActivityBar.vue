<template>
  <div class="activity-bar">
    <div class="activity-icons">
      <div 
        class="activity-icon" 
        :class="{ active: activePanel === 'explorer' }" 
        @click="$emit('toggle-panel', 'explorer')"
      >
        <v-icon size="32">mdi-folder-outline</v-icon>
      </div>
      <div 
        class="activity-icon" 
        :class="{ active: activePanel === 'search' }" 
        @click="$emit('toggle-panel', 'search')"
      >
        <v-icon size="32">mdi-magnify</v-icon>
      </div>
      <div 
        class="activity-icon" 
        :class="{ active: activePanel === 'git' }" 
        @click="$emit('toggle-panel', 'git')"
      >
        <v-icon size="32">mdi-source-branch</v-icon>
      </div>
    </div>
    <div class="activity-logo settings-icon" @click="$emit('open-tab', 'settings')">
      <v-icon size="32" color="primary" :class="{ active: gameMode === 'settings' }">mdi-cog-outline</v-icon>
      <span class="settings-badge"></span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activePanel: {
    type: String,
    default: null
  },
  gameMode: {
    type: String,
    default: null
  }
})

defineEmits(['toggle-panel', 'open-tab'])
</script>

<style scoped>
.activity-bar {
  width: 48px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  flex-shrink: 0;
  min-height: 0;
}

.activity-icons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  position: relative;
}

.activity-icon:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.activity-icon.active {
  color: var(--text-primary);
  background: var(--bg-primary);
}

.activity-icon.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--text-accent);
}

.activity-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.settings-icon:hover {
  background: rgba(255, 255, 255, 0.1);
}

.settings-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #007ACC;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.settings-icon:hover .settings-badge {
  opacity: 1;
}
</style>
