<script setup lang="ts">
// Top of a page. Renders the page's only <h1>, so use it once per page and never add a "#" heading elsewhere.
defineProps<{
  /** Hauptüberschrift der Seite (nur einmal pro Seite verwenden) */
  title: string
  /** Beschriftung des Buttons, z. B. „Termin vereinbaren“ */
  buttonLabel?: string
  /** Ziel des Buttons, z. B. /kontakt */
  buttonLink?: string
  /** Bild aus der Medienbibliothek, z. B. /bilder/team.webp */
  image?: string
  /** Kurze Beschreibung des Bildes für Google und Screenreader */
  imageAlt?: string
}>()
</script>

<template>
  <section class="py-16 sm:py-24">
    <UContainer class="grid items-center gap-10 lg:grid-cols-2">
      <div :class="!image && 'lg:col-span-2 text-center'">
        <h1 class="text-4xl font-bold tracking-tight text-highlighted sm:text-5xl text-balance">
          {{ title }}
        </h1>
        <div class="mt-6 text-lg text-muted">
          <slot />
        </div>
        <div v-if="buttonLabel && buttonLink" class="mt-8">
          <UButton :to="buttonLink" :label="buttonLabel" size="xl" trailing-icon="i-lucide-arrow-right" />
        </div>
      </div>
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="imageAlt || ''"
        width="800"
        height="600"
        format="webp"
        class="w-full rounded-xl object-cover aspect-[4/3]"
      />
    </UContainer>
  </section>
</template>
