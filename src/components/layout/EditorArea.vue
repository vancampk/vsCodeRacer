<template>
  <div class="editor-area">
    <!-- Editor Content -->
    <div class="editor-content" v-if="hasOpenTabs">
      <slot></slot>
    </div>
    
    <!-- Empty State -->
    <div class="editor-content empty-editor" v-else>
      <div class="empty-state">
        <v-icon size="48" color="secondary">mdi-file-code-outline</v-icon>
        <h3>No File Open</h3>
        <p>Select a file from the Explorer panel to start coding</p>
        <v-btn 
          variant="outlined" 
          @click="$emit('open-explorer')"
          class="open-explorer-btn"
        >
          <v-icon size="16" style="padding-right: 12px;">mdi-folder-open</v-icon>
          Open Explorer
        </v-btn>
      </div>
    </div>
    
    <!-- Bottom Terminal Panel -->
    <TerminalPanel
      :show="showBottomPanel"
      :loc-per-minute="currentWPM"
      :accuracy="accuracy"
      :lines-completed="linesCompleted"
      :time-elapsed="timeElapsed"
      :game-mode="gameMode"
      :average-wpm="averageWpm"
      @close="$emit('close-bottom-panel')"
    />

  </div>
</template>

<script setup>
import TerminalPanel from './TerminalPanel.vue'

defineProps({
  hasOpenTabs: {
    type: Boolean,
    default: false
  },
  showBottomPanel: {
    type: Boolean,
    default: false
  },
  currentWPM: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 100
  },
  linesCompleted: {
    type: Number,
    default: 0
  },
  timeElapsed: {
    type: Number,
    default: 0
  },
  gameMode: {
    type: String,
    default: 'none'
  },
  averageWpm: {
    type: Number,
    default: 0
  }
})

defineEmits(['open-explorer', 'close-bottom-panel'])
</script>

<style scoped>
.editor-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  position: relative;
}

.editor-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.empty-editor {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 48px;
}

.empty-state h3 {
  margin: 16px 0 8px 0;
  color: var(--text-primary);
  font-size: 20px;
}

.empty-state p {
  margin-bottom: 24px;
  font-size: 14px;
}

.open-explorer-btn {
  text-transform: none;
}
</style>

