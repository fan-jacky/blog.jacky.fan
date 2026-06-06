<script setup lang="ts">
import hljs from 'highlight.js/lib/common'
import IconsCopyClipboard from '~/components/icons/CopyClipboard.vue'

const props = withDefaults(
  defineProps<{
    code?: string | null
    language?: string | null
    showLineNumbers?: boolean | null
  }>(),
  {
    code: '',
    language: null,
    showLineNumbers: true,
  },
)

const normalizedLanguage = computed(() => props.language?.trim().toLowerCase() || '')

const highlightedHtml = computed(() => {
  const source = props.code ?? ''

  if (!source) {
    return ''
  }

  try {
    if (normalizedLanguage.value && hljs.getLanguage(normalizedLanguage.value)) {
      return hljs.highlight(source, {
        language: normalizedLanguage.value,
        ignoreIllegals: true,
      }).value
    }

    return hljs.highlightAuto(source).value
  } catch {
    return hljs.highlightAuto(source).value
  }
})

const highlightedLines = computed(() => highlightedHtml.value.split('\n'))

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}
</script>

<template>
  <div class="not-prose my-6">
    <div class="payload-code-block shadow relative rounded-2xl overflow-hidden">
      <div v-if="normalizedLanguage" class="payload-code-block__language">
        {{ normalizedLanguage }}
      </div>
      <pre
        class="payload-code-block__pre"><code class="hljs payload-code-block__code"> <span v-for="(line, index) in highlightedLines" :key="index" class="payload-code-block__line" :data-line-number="showLineNumbers ? index + 1 : undefined" v-html="line || '&nbsp;'" /> </code></pre>
      <button
        class="payload-code-block__copy btn btn-square btn-sm"
        aria-label="Copy code"
        type="button"
        @click="copyToClipboard(code)"
      >
        <IconsCopyClipboard class="p-1" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.payload-code-block {
  background: #030303;
  color: #e2e8f0;
}

.payload-code-block__language {
  border-bottom: 1px solid rgba(148, 163, 184, 0.24);
  color: #94a3b8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  padding: 0.75rem 1rem;
  text-transform: uppercase;
}

.payload-code-block__pre {
  margin: 0;
  overflow-x: auto;
  padding: 0 1rem 0 0;
}

.payload-code-block__code {
  background: transparent;
  display: block;
  font-size: 0.9rem;
  min-width: 100%;
  padding: 0;
}

.payload-code-block__line {
  display: block;
  min-height: 1.5rem;
  padding: 0 1rem 0 0;
}

.payload-code-block__line::before {
  color: rgba(148, 163, 184, 0.7);
  content: attr(data-line-number);
  display: inline-block;
  margin-right: 1rem;
  min-width: 2rem;
  padding-left: 1rem;
  text-align: right;
}

.payload-code-block__line:not([data-line-number])::before {
  content: none;
}

.payload-code-block__copy {
  position: absolute;
  right: 1rem;
  top: 0.75rem;
}
</style>