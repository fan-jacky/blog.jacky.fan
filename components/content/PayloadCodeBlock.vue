<script setup lang="ts">
import { ref } from 'vue'
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

const showToast = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
  showToast.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    showToast.value = false
  }, 2000)
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
        <IconsCopyClipboard />
      </button>
    </div>
    <Teleport to="body">
      <Transition name="copy-toast">
        <div v-if="showToast" class="copy-toast">
          Copied to clipboard
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
