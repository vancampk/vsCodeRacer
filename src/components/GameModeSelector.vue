<template>
  <div class="vscode-tabs">
    <div 
      @click="$emit('modeChanged', 'endless')"
      :class="['vscode-tab', { 'active': gameMode === 'endless' }]"
    >
      <v-icon size="14">mdi-code-braces</v-icon>
      <span class="tab-label">FreeCode.js</span>
      <div class="tab-close" v-if="gameMode === 'endless'">×</div>
    </div>
    <div 
      @click="$emit('modeChanged', 'sprint')"
      :class="['vscode-tab', { 'active': gameMode === 'sprint' }]"
    >
      <v-icon size="14">mdi-lightning-bolt</v-icon>
      <span class="tab-label">Sprint10.ts</span>
      <div class="tab-close" v-if="gameMode === 'sprint'">×</div>
    </div>
    <div 
      @click="$emit('modeChanged', 'timed')"
      :class="['vscode-tab', { 'active': gameMode === 'timed' }]"
    >
      <v-icon size="14">mdi-timer</v-icon>
      <span class="tab-label">Challenge60s.py</span>
      <div class="tab-close" v-if="gameMode === 'timed'">×</div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  gameMode: {
    type: String,
    default: 'sprint'
  }
})


const emit = defineEmits(['modeChanged'])
</script>

<style scoped>
.vscode-tabs {
  display: flex;
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-family: 'Fira Code', monospace;
  height: 35px;
}

.vscode-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 400;
  position: relative;
  min-width: 120px;
  user-select: none;
}

.vscode-tab:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.vscode-tab.active {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-top: 2px solid var(--text-accent);
  border-bottom: 1px solid var(--bg-secondary);
}

.tab-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tab-close {
  opacity: 0;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  color: var(--text-secondary);
  transition: opacity 0.2s ease;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
}

.vscode-tab:hover .tab-close,
.vscode-tab.active .tab-close {
  opacity: 1;
}

.tab-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

/* File type icons and colors */
.vscode-tab:nth-child(1) .v-icon {
  color: #f1c40f; /* JavaScript yellow */
}

.vscode-tab:nth-child(2) .v-icon {
  color: #3178c6; /* TypeScript blue */
}

.vscode-tab:nth-child(3) .v-icon {
  color: #3776ab; /* Python blue */
}

/* Responsive design */
@media (max-width: 768px) {
  .vscode-tab {
    min-width: 80px;
    padding: 0 8px;
  }
  
  .tab-label {
    font-size: 12px;
  }
  
  .tab-close {
    display: none;
  }
}
</style>