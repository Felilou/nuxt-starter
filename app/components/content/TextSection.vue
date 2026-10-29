<script setup lang="ts">
// Plain text section. The title is always an <h2>, so the heading structure stays correct for SEO.
defineProps<{
  /** Überschrift des Abschnitts */
  title: string
}>()
</script>

<template>
  <section class="py-12 sm:py-16">
    <UContainer class="max-w-3xl">
      <h2 class="text-3xl font-bold tracking-tight text-highlighted text-balance">
        {{ title }}
      </h2>
      <div class="mt-6 text-muted">
        <slot />
      </div>
    </UContainer>
  </section>
</template>
