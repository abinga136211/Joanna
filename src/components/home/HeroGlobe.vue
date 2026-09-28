<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { MAP_W, MAP_H, landPath, borderPath, coastPath } from '@/data/globePaths'

/** Uniform scale: map fills full SVG height so both hemispheres render */
const VIEW = 240
const CX = VIEW / 2
/** Fill viewBox so visual diameter == container size (== hero height) */
const R = 119.2
const scale = VIEW / MAP_H
const tileDx = MAP_W * scale

const rootEl = ref(null)
const orbitEl = ref(null)
const continentsEl = ref(null)
let raf = 0
let start = 0
let ro = null
const DURATION = 60000

function syncSize() {
  const orbit = orbitEl.value
  const hero = rootEl.value?.closest('section.hero')
  if (!orbit || !hero) return
  const h = hero.clientHeight
  orbit.style.width = `${h}px`
  orbit.style.height = `${h}px`
}

function tick(now) {
  if (!start) start = now
  const t = ((now - start) % DURATION) / DURATION
  const x = -tileDx * t
  if (continentsEl.value) {
    continentsEl.value.setAttribute('transform', `translate(${x} 0)`)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  syncSize()
  const hero = rootEl.value?.closest('section.hero')
  if (hero && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(syncSize)
    ro.observe(hero)
  }
  window.addEventListener('resize', syncSize)
  raf = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  window.removeEventListener('resize', syncSize)
})
</script>

<template>
  <div ref="rootEl" class="hero-globe" aria-hidden="true">
    <div ref="orbitEl" class="globe-orbit">
      <svg class="globe-svg" viewBox="0 0 240 240" fill="none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="globe-clip">
            <circle :cx="CX" :cy="CX" :r="R - 0.4" />
          </clipPath>
          <radialGradient id="globe-ocean" cx="42%" cy="38%" r="70%">
            <stop offset="0%" stop-color="#1c2230" />
            <stop offset="75%" stop-color="#0d111a" />
            <stop offset="100%" stop-color="#080b12" />
          </radialGradient>
          <radialGradient id="globe-vignette" cx="50%" cy="40%" r="70%">
            <stop offset="60%" stop-color="rgba(0,0,0,0)" />
            <stop offset="100%" stop-color="rgba(0,0,0,0.28)" />
          </radialGradient>
        </defs>

        <circle :cx="CX" :cy="CX" :r="R" fill="url(#globe-ocean)" />
        <circle class="globe-rim" :cx="CX" :cy="CX" :r="R" />

        <g clip-path="url(#globe-clip)">
          <g ref="continentsEl">
            <g
              v-for="n in 2"
              :key="'map-' + n"
              :transform="`translate(${(n - 1) * tileDx} 0) scale(${scale})`"
            >
              <path class="land-fill" :d="landPath" />
              <path class="land-coast" :d="coastPath" />
              <path class="land-border" :d="borderPath" />
            </g>
          </g>
          <circle :cx="CX" :cy="CX" :r="R - 0.4" fill="url(#globe-vignette)" />
        </g>
      </svg>
    </div>
  </div>
</template>
