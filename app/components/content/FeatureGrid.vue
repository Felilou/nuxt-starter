<script setup lang="ts">
// Grid of FeatureItem blocks. Clients add, remove and reorder items; the grid itself stays as designed.
defineProps<{
  /** Überschrift über den Karten */
  title: string
}>()
</script>

<template>
  <section class="py-12 sm:py-16">
    <UContainer>
      <h2 class="text-3xl font-bold tracking-tight text-highlighted text-center text-balance">
        {{ title }}
      </h2>
      <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <slot />
      </div>
    </UContainer>
  </section>
</template>
