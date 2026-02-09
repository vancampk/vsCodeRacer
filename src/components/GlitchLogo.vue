<template>
  <h1 class="logo-glitch" data-text="VSCodeRacer">
    <span class="logo-accent">VS</span><span class="logo-text">Code</span><span class="logo-accent">Racer</span>
    <span aria-hidden="true"><span class="logo-accent">VS</span><span class="logo-text">Code</span><span class="logo-accent">Racer</span></span>
    <span aria-hidden="true"><span class="logo-accent">VS</span><span class="logo-text">Code</span><span class="logo-accent">Racer</span></span>
  </h1>
</template>

<script setup>

</script>

<style scoped>
.logo-glitch {
  position: relative;
  display: inline-block;
  font-size: 0.9rem !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
  line-height: 1;
  -webkit-app-region: no-drag;
}

.logo-text {
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

.logo-text::before,
.logo-text::after {
  content: 'Code';
  position: absolute;
  top: 0;
  left: 0;
}

.logo-text::before {
  animation: glitch-1 500ms infinite;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
  text-shadow: 0.02em 0 0 #00fffc;
}

.logo-text::after {
  animation: glitch-2 375ms infinite;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(0.04em, 0.03em);
  opacity: 0.75;
  text-shadow: -0.02em 0 0 #fc00ff;
}

.logo-accent {
  color: var(--text-accent);
}

.logo-glitch span[aria-hidden="true"] {
  position: absolute;
  top: 0;
  left: 0;
}


@keyframes glitch {
  0% {
    text-shadow: 0.02em 0 0 #00fffc, -0.015em -0.02em 0 #fc00ff, 0.01em 0.02em 0 #fffc00;
  }
  15% {
    text-shadow: 0.02em 0 0 #00fffc, -0.015em -0.02em 0 #fc00ff, 0.01em 0.02em 0 #fffc00;
  }
  16% {
    text-shadow: -0.02em -0.01em 0 #00fffc, 0.01em 0.015em 0 #fc00ff, -0.02em -0.02em 0 #fffc00;
  }
  49% {
    text-shadow: -0.02em -0.01em 0 #00fffc, 0.01em 0.015em 0 #fc00ff, -0.02em -0.02em 0 #fffc00;
  }
  50% {
    text-shadow: 0.02em 0.015em 0 #00fffc, 0.015em 0 0 #fc00ff, 0 -0.02em 0 #fffc00;
  }
  99% {
    text-shadow: 0.02em 0.015em 0 #00fffc, 0.015em 0 0 #fc00ff, 0 -0.02em 0 #fffc00;
  }
  100% {
    text-shadow: -0.02em 0 0 #00fffc, -0.01em -0.02em 0 #fc00ff, -0.02em -0.01em 0 #fffc00;
  }
}

@media (max-width: 768px) {
  .logo-glitch {
    font-size: 1rem !important;
    letter-spacing: 0.5px;
  }
}
</style>