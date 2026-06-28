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
  <div>
    <div class="payload-code-block">
      <div v-if="normalizedLanguage" class="payload-code-block__language">
        {{ normalizedLanguage }}
      </div>
      <pre
        class="payload-code-block__pre"><code class="hljs payload-code-block__code"> <span v-for="(line, index) in highlightedLines" :key="index" class="payload-code-block__line" :data-line-number="showLineNumbers ? index + 1 : undefined" v-html="line || '&nbsp;'" /> </code></pre>
      <button
        class="payload-code-block__copy"
        aria-label="Copy code"
        type="button"
        @click="copyToClipboard(code ?? '')"
      >
        <IconsCopyClipboard class="p-1" />
      </button>
    </div>
  </div>
</template>