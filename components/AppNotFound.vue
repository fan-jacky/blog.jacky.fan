<script setup lang="ts">
withDefaults(
  defineProps<{
    statusCode?: number
    statusMessage?: string
    description?: string
  }>(),
  {
    statusCode: 404,
    statusMessage: 'Page not found',
    description: 'The page you requested does not exist or is no longer available.',
  }
)
</script>

<template>
  <div class="site-wrapper">
    <NavBar />
    <main id="main-content" class="site-main">
      <section class="site-section" style="text-align:center;display:flex;align-items:center;justify-content:center;min-height:calc(100vh - 64px);padding-top:0;padding-bottom:0">
        <div class="geo-circle geo-circle--lg" style="top:-80px;right:-80px;" />
        <div class="geo-circle geo-circle--sm" style="bottom:10%;left:8%;" />
        <div class="container">
          <span class="section-label reveal">Error</span>
          <h1 class="section-headline reveal" style="font-size:clamp(4rem,10vw,8rem);line-height:1;margin-bottom:0.5rem">
            {{ statusCode }}
          </h1>
          <p class="section-subtitle reveal" style="max-width:480px;margin:0 auto 1rem">
            {{ statusMessage }}
          </p>
          <p class="reveal" style="max-width:480px;margin:0 auto 2rem;color:var(--text-muted);font-size:1rem;line-height:1.6">
            {{ description }}
          </p>
          <div class="reveal">
            <NuxtLink to="/" class="show-more__button">
              Back to home
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>
