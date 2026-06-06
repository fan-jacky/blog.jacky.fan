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
  <div class="min-h-screen bg-base-200 font-outfit text-base-content">
    <NavBar />

    <main class="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.4em] text-primary">Error</p>
      <h1 class="mt-4 text-6xl font-black text-primary md:text-8xl">{{ statusCode }}</h1>
      <p class="mt-6 text-2xl font-semibold md:text-3xl">{{ statusMessage }}</p>
      <p class="mt-4 max-w-xl text-base-content/80">
        {{ description }}
      </p>
      <div class="mt-8">
        <NuxtLink to="/" class="btn btn-primary">
          Back to home
        </NuxtLink>
      </div>
    </main>

    <Footer />
  </div>
</template>