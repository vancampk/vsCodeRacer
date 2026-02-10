<template>
  <div class="snippets-viewer">
    <div class="snippets-editor">
      <div class="code-lines">
        <div 
          v-for="(line, index) in snippetLines" 
          :key="index" 
          class="code-line"
        >
          <span class="line-number">{{ index + 1 }}</span>
          <span class="line-content">{{ line }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../../stores/gameStore'

const gameStore = useGameStore()

const snippetLines = computed(() => {
  if (!gameStore.currentSnippet) return []
  return gameStore.currentSnippet.split('\n')
})
</script>

<style scoped>
.snippets-viewer {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--vscode-editor-background);
}

.snippets-editor {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  background: var(--vscode-editor-background);
}

.code-lines {
  padding: 20px 0;
}

.code-line {
  display: flex;
  min-height: 1.375em;
  padding: 0;
  color: var(--vscode-editor-foreground);
}

.line-number {
  width: 50px;
  padding: 0 1em 0 1em;
  text-align: right;
  color: var(--vscode-editorLineNumber-foreground);
  background: var(--vscode-editorGutter-background);
  user-select: none;
  flex-shrink: 0;
  font-size: 0.75em;
  line-height: 1.375em;
}

.line-content {
  padding: 0 1em;
  white-space: pre;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  line-height: 1.375em;
}

.snippets-editor::-webkit-scrollbar {
  width: 12px;
}

.snippets-editor::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.snippets-editor::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.snippets-editor::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>