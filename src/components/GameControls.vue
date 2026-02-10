<template>
  <div class="controls">
    <button @click="$emit('saveAndReset')" class="save-btn">Save & Reset</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['saveAndReset'])
</script>

<style scoped>
.controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding: 0.5rem 0;
}

.save-btn {
  padding: 0.4rem 1rem;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--text-accent);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  min-width: 90px;
  font-family: 'Fira Code', monospace;
}

.save-btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>