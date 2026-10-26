<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { MAP_W, MAP_H, landPath } from '@/data/globePaths'

const props = defineProps({
  /** Prefix SVG paint-server IDs when multiple globes share a page */
  idPrefix: { type: String, default: 'why' },
})

const VIEW = 520
const CX = VIEW / 2
const R = 248
/** Uniform scale so map height fills the globe */
const scale = (R * 2) / MAP_H
const tileDx = MAP_W * scale
const mapY = CX - MAP_H * scale * 0.5

const ids = computed(() => {
  const p = props.idPrefix
  return {
    ocean: `${p}-globe-ocean`,
    shade: `${p}-globe-shade`,
    spec: `${p}-globe-spec`,
    dotGrad: `${p}-dot-grad`,
    dotPattern: `${p}-dot-pattern`,
    clip: `${p}-globe-clip`,
    landMask: `${p}-land-mask`,
  }
})

const continentsEl = ref(null)
let raf = 0
let start = 0
const DURATION = 48000

function tick(now) {
  if (!start) start = now
  const t = ((now - start) % DURATION) / DURATION
  const x = -tileDx * t
  if (continentsEl.value) {
    continentsEl.value.setAttribute('transform', `translate(${x} ${mapY})`)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="why-globe" aria-hidden="true">
    <div class="why-globe-sphere">
      <svg class="why-globe-svg" viewBox="0 0 520 520" fill="none">
        <defs>
          <radialGradient :id="ids.ocean" cx="38%" cy="36%" r="68%">
            <stop offset="0%" stop-color="#fff8f7" />
            <stop offset="55%" stop-color="#fff5f4" />
            <stop offset="100%" stop-color="#fceae9" />
          </radialGradient>
          <radialGradient :id="ids.shade" cx="32%" cy="34%" r="72%">
            <stop offset="40%" stop-color="rgba(255,255,255,0)" />
            <stop offset="78%" stop-color="rgba(225,37,27,0.06)" />
            <stop offset="100%" stop-color="rgba(122,12,30,0.18)" />
          </radialGradient>
          <radialGradient :id="ids.spec" cx="30%" cy="28%" r="42%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.55)" />
            <stop offset="45%" stop-color="rgba(255,255,255,0.12)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient :id="ids.dotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F6A623" />
            <stop offset="45%" stop-color="#E1251B" />
            <stop offset="100%" stop-color="#C8102E" />
          </linearGradient>
          <pattern
            :id="ids.dotPattern"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2.2" cy="2.2" r="1.35" :fill="`url(#${ids.dotGrad})`" />
          </pattern>
          <clipPath :id="ids.clip">
            <circle :cx="CX" :cy="CX" :r="R" />
          </clipPath>
          <mask :id="ids.landMask">
            <rect :width="VIEW" :height="VIEW" fill="black" />
            <g ref="continentsEl" :transform="`translate(0 ${mapY})`">
              <g
                v-for="n in 2"
                :key="idPrefix + '-map-' + n"
                :transform="`translate(${(n - 1) * tileDx} 0) scale(${scale})`"
              >
                <path :d="landPath" fill="white" />
              </g>
            </g>
          </mask>
        </defs>

        <circle class="why-globe-rim" :cx="CX" :cy="CX" :r="R" />
        <circle :cx="CX" :cy="CX" :r="R" :fill="`url(#${ids.ocean})`" />

        <g :clip-path="`url(#${ids.clip})`" :mask="`url(#${ids.landMask})`">
          <rect :width="VIEW" :height="VIEW" :fill="`url(#${ids.dotPattern})`" />
        </g>

        <!-- Fixed sphere lighting for 3D volume -->
        <circle :cx="CX" :cy="CX" :r="R" :fill="`url(#${ids.shade})`" />
        <circle :cx="CX" :cy="CX" :r="R" :fill="`url(#${ids.spec})`" />

        <!-- Latitude / longitude hints -->
        <ellipse
          class="why-globe-lat"
          :cx="CX"
          :cy="CX"
          :rx="R * 0.98"
          :ry="R * 0.28"
        />
        <ellipse
          class="why-globe-lat"
          :cx="CX"
          :cy="CX"
          :rx="R * 0.98"
          :ry="R * 0.55"
        />
        <ellipse
          class="why-globe-meridian"
          :cx="CX"
          :cy="CX"
          :rx="R * 0.42"
          :ry="R * 0.98"
        />
      </svg>
    </div>
  </div>
</template>
