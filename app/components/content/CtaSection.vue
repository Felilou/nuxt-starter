<script setup lang="ts">
// Call to action, usually at the end of a page.
defineProps<{
  /** Überschrift, z. B. „Bereit für Ihr Projekt?“ */
  title: string
  /** Beschriftung des Buttons */
  buttonLabel: string
  /** Ziel des Buttons, z. B. /kontakt */
  buttonLink: string
}>()
</script>

<template>
  <section class="py-12 sm:py-16">
    <UContainer>
      <div class="rounded-2xl bg-elevated px-6 py-12 text-center sm:px-12">
        <h2 class="text-3xl font-bold tracking-tight text-highlighted text-balance">
          {{ title }}
        </h2>
        <div class="mx-auto mt-4 max-w-2xl text-muted">
          <slot />
        </div>
        <UButton :to="buttonLink" :label="buttonLabel" size="xl" class="mt-8" />
      </div>
    </UContainer>
  </section>
</template>
