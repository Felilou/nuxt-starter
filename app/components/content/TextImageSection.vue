<script setup lang="ts">
// Text next to an image. The image side is fixed here on purpose, so clients change content, not layout.
defineProps<{
  /** Überschrift des Abschnitts */
  title: string
  /** Bild aus der Medienbibliothek, z. B. /bilder/werkstatt.webp */
  image: string
  /** Kurze Beschreibung des Bildes für Google und Screenreader */
  imageAlt: string
}>()
</script>

<template>
  <section class="py-12 sm:py-16">
    <UContainer class="grid items-center gap-10 lg:grid-cols-2">
      <NuxtImg
        :src="image"
        :alt="imageAlt"
        width="800"
        height="600"
        format="webp"
        loading="lazy"
        class="w-full rounded-xl object-cover aspect-[4/3]"
      />
      <div>
        <h2 class="text-3xl font-bold tracking-tight text-highlighted text-balance">
          {{ title }}
        </h2>
        <div class="mt-6 text-muted">
          <slot />
        </div>
      </div>
    </UContainer>
  </section>
</template>
