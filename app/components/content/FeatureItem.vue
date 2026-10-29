<script setup lang="ts">
// One card inside FeatureGrid.
defineProps<{
  /** Überschrift der Karte */
  title: string
  /** Icon aus Lucide, z. B. i-lucide-zap (Übersicht: lucide.dev/icons) */
  icon?: string
}>()
</script>

<template>
  <div>
    <UIcon v-if="icon" :name="icon" class="size-8 text-primary" />
    <h3 class="mt-4 text-lg font-semibold text-highlighted">
      {{ title }}
    </h3>
    <div class="mt-2 text-muted">
      <slot />
    </div>
  </div>
</template>
