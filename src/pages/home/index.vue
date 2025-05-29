<route lang="json5">
{ meta: { title: 'Home' } }
</route>

<template>
  <!-- <InspLiquidBg class="absolute inset-0" /> -->
  <InspParticlesBg
    class="absolute inset-0"
    :quantity="100"
    :ease="100"
    :color="isDark ? '#FFF' : '#000'"
    :key="isDark.toString()"
    :staticity="10"
    refresh
  />
  <!-- 
  <InspPatternBg
    class="flex h-[36rem] w-full items-center justify-center"
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.Bottom"
    :variant="PATTERN_BACKGROUND_VARIANT.BigDot"
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
    :mask="PATTERN_BACKGROUND_MASK.EllipseTop"
  >
    <p
      class="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-5xl"
    >
      Big Dot Background
    </p>
  </InspPatternBg> -->
  <div>home page</div>
</template>

<script setup lang="ts">
import InspLiquidBg from '@/components/Inspira/InspLiquidBg.vue'
import InspParticlesBg from '@/components/Inspira/InspParticlesBg.vue'
// import InspPatternBg from '@/components/Inspira/InspPatternBg.vue'

// import {
//   PATTERN_BACKGROUND_DIRECTION,
//   PATTERN_BACKGROUND_MASK,
//   PATTERN_BACKGROUND_SPEED,
//   PATTERN_BACKGROUND_VARIANT,
// } from '@/components/Inspira/patternBg'

import { useBaseStore } from '@/stores/base.module'

const { setting } = useBaseStore()
const { isDark } = setting
</script>
