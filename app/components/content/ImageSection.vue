<script setup lang="ts">
// Full-width image with an optional caption.
defineProps<{
  /** Bild aus der Medienbibliothek, z. B. /bilder/projekt.webp */
  image: string
  /** Kurze Beschreibung des Bildes für Google und Screenreader */
  imageAlt: string
  /** Bildunterschrift (optional) */
  caption?: string
}>()
</script>

<template>
  <section class="py-12 sm:py-16">
    <UContainer>
      <figure>
        <NuxtImg
          :src="image"
          :alt="imageAlt"
          width="1600"
          height="900"
          format="webp"
          loading="lazy"
          class="w-full rounded-xl object-cover aspect-video"
        />
        <figcaption v-if="caption" class="mt-3 text-center text-sm text-muted">
          {{ caption }}
        </figcaption>
      </figure>
    </UContainer>
  </section>
</template>
