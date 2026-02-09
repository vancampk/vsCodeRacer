<script setup>
import TypingGame from './components/TypingGame.vue'
</script>

<template>
  <TypingGame />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
