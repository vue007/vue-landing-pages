<route lang="json5">
{ meta: { title: 'Home' } }
</route>

<template>
  <!-- <InspLiquidBg class="absolute inset-0" /> -->
  <InspParticlesBg
    ref="particlesBg"
    class="absolute inset-0"
    :quantity="100"
    :ease="100"
    :color="setting.isDark ? '#FFF' : '#111'"
    :staticity="10"
  />
  <div>home page</div>
</template>

<script setup lang="ts">
// import InspLiquidBg from '@/components/Inspira/InspLiquidBg.vue'
import InspParticlesBg from '@/components/Inspira/InspParticlesBg.vue'

import { useBaseStore } from '@/stores/base.module'

const { setting } = useBaseStore()

const particlesBg = ref<InstanceType<typeof InspParticlesBg> | null>(null)
</script>
