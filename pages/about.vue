<script setup lang="ts">
import type { PayloadAbout } from '~/types/payload'

useHead({
  title: 'About — Jacky FAN',
  meta: [
    {
      name: 'description',
      content: 'About Jacky FAN — frontend developer based in Hong Kong.',
    },
  ],
})

const config = useRuntimeConfig()
const about = await $fetch<PayloadAbout>(`${config.payloadUrl}/api/globals/about`)

const bodyNodes = computed(() => about?.body ?? [])
</script>

<template>
  <div class="site-wrapper">
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section site-section--about about-page">
        <div class="geo-circle geo-circle--sm" style="top:15%;right:6%;" />
        <div class="container container--narrow">
          <span class="section-label reveal">About</span>
          <h1 class="section-headline reveal">Hi, I'm Jacky</h1>
          <p class="section-subtitle reveal">A frontend developer based in Hong Kong.</p>

          <div class="about-page__body reveal">
            <SlateRenderer v-if="bodyNodes.length > 0" :nodes="bodyNodes" />
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
