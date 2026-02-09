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
  height: 100%;
  overflow: hidden;
  background: var(--vscode-editor-background);
  text-align: left;
}

.snippets-editor {
  height: 100%;
  overflow-y: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  background: var(--vscode-editor-background);
  text-align: left;
}

.code-lines {
  padding: 20px 0;
  text-align: left;
}

.code-line {
  display: flex;
  min-height: 1.375em;
  padding: 0;
  color: var(--vscode-editor-foreground);
  text-align: left;
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
  text-align: left;
}

.snippets-editor::-webkit-scrollbar {
  width: 12px;
}

.snippets-editor::-webkit-scrollbar-track {
  background: var(--vscode-scrollbar-shadow);
}

.snippets-editor::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
  border-radius: 6px;
}

.snippets-editor::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-scrollbarSlider-hoverBackground);
}
</style>