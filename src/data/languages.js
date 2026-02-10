export const languages = [
  { value: 'all', name: 'All Languages', icon: 'mdi-code-braces', extension: 'txt' },
  { value: 'css', name: 'CSS', icon: 'mdi-language-css3', extension: 'css' },
  { value: 'go', name: 'Go', icon: 'mdi-language-go', extension: 'go' },
  { value: 'java', name: 'Java', icon: 'mdi-language-java', extension: 'java' },
  { value: 'javascript', name: 'JavaScript', icon: 'mdi-language-javascript', extension: 'js' },
  { value: 'nodejs', name: 'Node.js/Express', icon: 'mdi-nodejs', extension: 'js' },
  { value: 'python', name: 'Python', icon: 'mdi-language-python', extension: 'py' },
  { value: 'react', name: 'React', icon: 'mdi-react', extension: 'jsx' },
  { value: 'regex', name: 'Regex', icon: 'mdi-regex', extension: 'regex' },
  { value: 'rust', name: 'Rust', icon: 'mdi-language-rust', extension: 'rs' },
  { value: 'shell', name: 'Shell/Git/Docker', icon: 'mdi-console', extension: 'sh' },
  { value: 'sql', name: 'SQL', icon: 'mdi-database', extension: 'sql' },
  { value: 'typescript', name: 'TypeScript', icon: 'mdi-language-typescript', extension: 'ts' },
  { value: 'vue', name: 'Vue', icon: 'mdi-vuejs', extension: 'vue' }
]

// Helper functions
export const getLanguageIcon = (lang) => {
  const language = languages.find(l => l.value === lang)
  return language ? language.icon : 'mdi-code-braces'
}

export const getLanguageExtension = (lang) => {
  const language = languages.find(l => l.value === lang)
  return language ? language.extension : 'txt'
}

export const getLanguageName = (lang) => {
  const language = languages.find(l => l.value === lang)
  return language ? language.name : lang
}
