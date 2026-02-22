# vsCodeRacer

A modern code typing game built with Vue 3 that helps developers improve their typing speed and accuracy by practicing with real code snippets.

https://vancampk.github.io/vsCodeRacer/

## 🎮 Game Modes

### 10 Line Sprint
Complete 10 lines of code as fast as possible. Perfect for quick practice sessions and testing your raw typing speed.

### 60s Challenge
Type as many lines as you can in 60 seconds. Great for building consistency and maintaining focus under time pressure.

### Free Code
Practice at your own pace with no time limits or line goals. Ideal for learning new syntax patterns and building muscle memory.

### All Snippets
Browse and practice from the entire collection of code snippets. Select specific languages or snippets to focus on.

## ✨ Features

### Multi-Language Support
Practice typing in multiple programming languages:
- JavaScript & Node.js
- TypeScript
- Python
- React & Vue
- Java
- Go
- Rust
- SQL
- CSS
- Shell Scripts
- Regular Expressions

### Real-Time Feedback
- **Character-by-Character Validation**: Instant visual feedback on each keystroke
- **Error Highlighting**: Wrong characters are highlighted in red
- **Accurate Cursor Position**: Always know exactly where you are in the code
- **Line-by-Line Progress**: Advance through code snippets naturally

### Comprehensive Statistics
- **WPM (Words Per Minute)**: Real-time typing speed calculation
- **Accuracy Tracking**: Monitor your error rate percentage
- **Time Tracking**: Precise timing for all game modes
- **Historical Stats**: Track your progress over time with Chart.js visualizations
- **Per-Language Stats**: See your performance breakdown by programming language

### Customization
- **Theme Selector**: Choose from multiple color themes including:
  - Monokai
  - Dracula
  - Nord
  - Solarized Light/Dark
  - VS Code Dark+
  - GitHub Dark/Light
- **Adjustable Settings**: Customize your experience with various game options
- **Persistent Preferences**: Your settings and stats are saved locally

### Modern UI/UX
- **Vuetify Components**: Clean, Material Design interface
- **Responsive Design**: Works seamlessly on desktop and tablet
- **Smooth Animations**: Polished transitions and visual effects
- **Glitch Logo Effect**: Eye-catching animated branding
- **Glass-morphism Effects**: Modern, sleek visual style

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vsCodeRacer.git
   cd vsCodeRacer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 🛠️ Tech Stack

- **Vue 3**: Composition API with `<script setup>` syntax
- **Vuetify 3**: Material Design component framework
- **Pinia**: State management for game, settings, and stats
- **Chart.js**: Data visualization for statistics
- **Vite**: Lightning-fast build tool and dev server
- **MDI Icons**: Material Design Icons for UI elements

## 📁 Project Structure

```
src/
├── components/
│   ├── modes/              # Game mode implementations
│   │   ├── ChallengeMode.vue
│   │   ├── FreeCodeMode.vue
│   │   ├── SnippetsViewer.vue
│   │   └── SprintMode.vue
│   ├── shared/             # Reusable components
│   │   └── CodeEditor.vue
│   ├── GameControls.vue
│   ├── GameModeSelector.vue
│   ├── SettingsPanel.vue
│   ├── StatsPanel.vue
│   └── ...
├── stores/                 # Pinia stores
│   ├── gameStore.js       # Game state and logic
│   ├── settingsStore.js   # User preferences
│   └── statsStore.js      # Statistics tracking
├── data/                   # Code snippets and word lists
│   ├── blocks/            # Language-specific code blocks
│   └── codeSnippets.js    # Main snippet collection
├── composables/           # Reusable composition functions
└── plugins/               # Vue plugins configuration
```

## How to Play

1. **Select a Game Mode**: Choose from Sprint, Challenge, Free Code, or browse all snippets
2. **Pick a Language** (optional): Focus on specific programming languages or practice all
3. **Start Typing**: Begin typing to start the timer
4. **Follow the Code**: Type each character exactly as shown, including spaces and special characters
5. **Complete Lines**: Press Enter to move to the next line (only when the current line is correct)
6. **Track Your Progress**: Watch your WPM and accuracy in real-time
7. **Review Stats**: Check your detailed statistics when you finish

### Keyboard Shortcuts
- **Enter**: Move to next line (when current line is correct)
- **Escape**: Pause game (in timed modes)
- **Tab**: Start new game / Reset

## Themes

vsCodeRacer includes popular code editor themes to match your preferred coding environment:
- Monokai (classic dark theme)
- Dracula (purple-focused dark theme)
- Nord (arctic, north-bluish theme)
- Solarized Dark & Light (precision colors for machines and people)
- VS Code Dark+ (default VS Code theme)
- GitHub Dark & Light (GitHub's code themes)

## Statistics

The app tracks comprehensive statistics including:
- Total games played
- Average WPM across all games
- Overall accuracy percentage
- Total time spent practicing
- Performance trends over time
- Per-language proficiency

All stats are stored locally in your browser and persist between sessions.

## Contributing

Contributions are welcome! Feel free to:
- Add new code snippets
- Implement new themes
- Suggest new game modes
- Report bugs
- Improve documentation

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Code snippets curated from real-world examples
- Color themes inspired by popular code editors
- Built with modern Vue 3 best practices
