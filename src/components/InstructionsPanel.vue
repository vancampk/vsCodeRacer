<template>
  <div class="instructions-panel">
    <div class="instructions-header">
      <h2>
        <v-icon size="24">mdi-information-outline</v-icon>
        Getting Started with vsCodeRacer
      </h2>
    </div>

    <div class="instructions-content">
      <section class="instruction-section">
        <h3>Game Modes</h3>
        <div class="mode-list">
          <div class="mode-item">
            <strong>10 Line Sprint</strong>
            <p>Complete 10 lines of code as fast as possible. Perfect for quick practice sessions and testing your raw typing speed.</p>
          </div>
          <div class="mode-item">
            <strong>60s Challenge</strong>
            <p>Type as many lines as you can in 60 seconds. Build consistency and maintain focus under time pressure.</p>
          </div>
          <div class="mode-item">
            <strong>Free Code</strong>
            <p>Practice at your own pace with no time limits or line goals. Ideal for learning new syntax patterns.</p>
          </div>        
        </div>
      </section>

      <section class="instruction-section">
        <h3>Other Files</h3>
        <div class="mode-list">          
          <div class="mode-item">
            <strong>All Snippets</strong>
            <p>Browse and practice from the entire collection of code snippets. Select specific languages or snippets to focus on.</p>
          </div>        
          <div class="mode-item">
            <strong>README</strong>
            <p>These Instructions!</p>
          </div>
        </div>
      </section>

      <section class="instruction-section">
        <h3>How to Play</h3>
        <ol>
          <li>Select a game mode from the file explorer (left panel)</li>
          <li>Start typing to begin - the timer starts automatically</li>
          <li>Type each character exactly as shown, including spaces and special characters</li>
          <li>Press <kbd>Enter</kbd> to move to the next line (only when current line is correct)</li>
          <li>Watch your WPM (Words Per Minute) and accuracy in real-time in the bottom stats bar</li>
          <li>Complete the challenge to see your final stats!</li>
        </ol>
      </section>

      <section class="instruction-section">
        <h3>Keyboard Shortcuts</h3>
        <div class="shortcuts-grid">
          <div class="shortcut-item">
            <kbd>Enter</kbd>
            <span>Next line (when correct)</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>Pause game (timed modes)</span>
          </div>
        </div>
      </section>

      <section class="instruction-section">
        <h3>Customization</h3>
        <p>Click the settings icon (⚙️) at the bottom of the left sidebar to:</p>
        <ul>
          <li>Change color themes (Monokai, Dracula, Nord, and more)</li>
          <li>Toggle line numbers</li>
          <li>Enable focus mode</li>
          <li>Select preferred programming languages</li>
          <li>Configure other preferences</li>
        </ul>
      </section>

      <section class="instruction-section">
        <h3>Statistics</h3>
        <p>Track your progress with comprehensive stats:</p>
        <ul>
          <li><strong>WPM</strong> - Words per minute (calculated using standard 5-character words)</li>
          <li><strong>Accuracy</strong> - Percentage of correct keystrokes</li>
          <li><strong>Time</strong> - Duration of your typing session</li>
          <li><strong>History</strong> - View charts and trends over time</li>
          <li><strong>Per-Language Stats</strong> - See performance breakdown by language</li>
        </ul>
      </section>

      <section class="instruction-section">
        <h3>Supported Languages</h3>
        <div class="languages-grid">
          <span class="language-badge">JavaScript</span>
          <span class="language-badge">TypeScript</span>
          <span class="language-badge">Python</span>
          <span class="language-badge">React</span>
          <span class="language-badge">Vue</span>
          <span class="language-badge">Node.js</span>
          <span class="language-badge">Java</span>
          <span class="language-badge">Go</span>
          <span class="language-badge">Rust</span>
          <span class="language-badge">SQL</span>
          <span class="language-badge">CSS</span>
          <span class="language-badge">Shell</span>
          <span class="language-badge">Regex</span>
        </div>
      </section>

      <section class="instruction-section last-section">
        <h3>Ready to Start?</h3>
        <p>Choose a game mode from the file explorer and start typing! Your progress and settings will be saved locally.</p>
        <p class="tip-highlight">Pro Tip: Start with Free Code mode to familiarize yourself with the interface before trying timed challenges.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
// No special logic needed for static instructions
</script>

<style scoped>
.instructions-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  color: var(--text-primary);
  background: var(--bg-primary);
}

.instructions-header {
  padding: 24px 32px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  position: sticky;
  top: 0;
  z-index: 1;
}

.instructions-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-primary);
}

.instructions-content {
  padding: 24px 32px 40px;
  max-width: 900px;
  text-align: left;
}

.instruction-section {
  margin-bottom: 32px;
}

.instruction-section.last-section {
  margin-bottom: 0;
}

.instruction-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-accent);
  text-align: left;
}

.instruction-section p {
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.instruction-section ul,
.instruction-section ol {
  line-height: 1.8;
  color: var(--text-primary);
  padding-left: 24px;
}

.instruction-section li {
  margin-bottom: 8px;
}

.mode-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mode-item {
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 3px solid var(--text-accent);
}

.mode-item strong {
  display: block;
  color: var(--text-accent);
  margin-bottom: 8px;
  font-size: 15px;
}

.mode-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 6px;
}

.shortcut-item span {
  color: var(--text-secondary);
  font-size: 14px;
}

kbd {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: var(--text-accent);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
}

.languages-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.language-badge {
  padding: 6px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  font-size: 13px;
  color: var(--text-primary);
}

.tip-highlight {
  padding: 12px 16px;
  background: var(--highlight-bg);
  border-left: 3px solid var(--text-accent);
  border-radius: 4px;
  margin-top: 16px;
}

/* Scrollbar styling */
.instructions-panel::-webkit-scrollbar {
  width: 12px;
}

.instructions-panel::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

.instructions-panel::-webkit-scrollbar-thumb {
  background: var(--bg-tertiary);
  border-radius: 6px;
}

.instructions-panel::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
