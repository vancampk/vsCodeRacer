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
  bottom: 8px;
  right: 4px;
  width: 16px;
  height: 16px;
  background: #ccbe00;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(204, 190, 0, 0.5),
              0 0 8px rgba(204, 190, 0, 0.3);
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 4px rgba(204, 190, 0, 0.5),
                0 0 8px rgba(204, 190, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 6px rgba(204, 190, 0, 0.7),
                0 0 10px rgba(204, 190, 0, 0.4);
  }
}

</style>
