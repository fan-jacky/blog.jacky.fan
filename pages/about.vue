<script setup lang="ts">
useHead({
  title: 'About — Jacky FAN',
  meta: [
    {
      name: 'description',
      content: 'About Jacky FAN — frontend developer based in Hong Kong.',
    },
  ],
})
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
            <p>I'm <strong>Jacky FAN</strong> — a frontend developer based in Hong Kong. I build things for the web, mostly with TypeScript, React, and Vue.</p>
            <p>This blog is where I write about things I'm learning, building, or thinking about. Topics tend to orbit around web development, dev tooling, self-hosting, and the occasional hardware experiment.</p>

            <h2>Elsewhere</h2>
            <ul>
              <li><a href="https://jacky.fan" target="_blank" rel="noopener">Portfolio — jacky.fan</a></li>
              <li><a href="https://github.com/redfrogsss" target="_blank" rel="noopener">GitHub — @redfrogsss</a></li>
            </ul>

            <h2>Colophon</h2>
            <p>This site is built with <strong>Nuxt 3</strong>. Content is managed through <strong>Payload CMS</strong>. The type system stays aligned through generated Payload types, and the frontend now follows the same editorial design language as the new prototype.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>