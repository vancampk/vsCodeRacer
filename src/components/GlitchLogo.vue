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
  font-size: 3rem !important;
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
  animation: glitch-1 3700ms infinite;
  animation-timing-function: steps(1, end);
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-0.04em, -0.03em);
  opacity: 0.75;
  text-shadow: 0.02em 0 0 #00fffc;
}

.logo-text::after {
  animation: glitch-2 4300ms infinite;
  animation-timing-function: steps(1, end);
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

@keyframes glitch-1 {
  0% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  2% {
    transform: translate(-2px, 2px);
    opacity: 0.8;
  }
  4% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  10% {
    transform: translate(3px, -1px);
    opacity: 0.7;
  }
  12% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  20% {
    transform: translate(-1px, -3px);
    opacity: 0.85;
  }
  22% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  38% {
    transform: translate(2px, 3px);
    opacity: 0.7;
  }
  40% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  60% {
    transform: translate(-3px, 1px);
    opacity: 0.8;
  }
  62% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  75% {
    transform: translate(1px, -2px);
    opacity: 0.7;
  }
  77% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  95% {
    transform: translate(2px, 2px);
    opacity: 0.85;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
}

@keyframes glitch-2 {
  0% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  5% {
    transform: translate(2px, -3px);
    opacity: 0.7;
  }
  7% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  15% {
    transform: translate(-3px, 2px);
    opacity: 0.8;
  }
  17% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  30% {
    transform: translate(1px, 3px);
    opacity: 0.85;
  }
  32% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  45% {
    transform: translate(-2px, -1px);
    opacity: 0.7;
  }
  47% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  65% {
    transform: translate(3px, 1px);
    opacity: 0.8;
  }
  67% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  80% {
    transform: translate(-1px, 2px);
    opacity: 0.7;
  }
  82% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
  92% {
    transform: translate(2px, -2px);
    opacity: 0.85;
  }
  100% {
    transform: translate(0, 0);
    opacity: 0.75;
  }
}

@media (max-width: 768px) {
  .logo-glitch {
    font-size: 1rem !important;
    letter-spacing: 0.5px;
  }
}
</style>