<template>
  <div class="title-bar">
    <div class="title-bar-left">
      <GlitchLogo />
    </div>
    
    <div class="title-bar-center">
      
    </div>
    
    <div class="title-bar-right">
      <GameControls 
        @save-and-reset="$emit('save-and-reset')" 
      />
    </div>
  </div>
</template>

<script setup>
import GlitchLogo from '../GlitchLogo.vue'
import GameControls from '../GameControls.vue'

defineEmits(['save-and-reset'])
</script>

<style scoped>
.title-bar {
  height: 60px;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  -webkit-app-region: drag;
}

.title-bar-left,
.title-bar-center,
.title-bar-right {
  display: flex;
  align-items: center;
  flex: 1;
}

.title-bar-center {
  justify-content: center;
}

.title-bar-right {
  justify-content: flex-end;
}
</style>
