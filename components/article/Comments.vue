<template>
    <div class="bg-base-100 rounded-lg shadow-md my-4 px-3 md:px-8 py-12">
        <p class="prose">
        <h4>
            <IconsComments class="inline h-[1.2rem] mb-1 mx-1" />Comments
        </h4>
        </p>
    </div>
</template>
<script>
import { useDark } from '@vueuse/core';

const isDark = useDark()

export default {
    mounted() {
        console.log('isDark', isDark.value)
        const scriptTag = document.createElement('SCRIPT')
        scriptTag.setAttribute('src', 'https://utteranc.es/client.js')
        scriptTag.setAttribute('repo', 'redfrogsss/blog-comments')
        scriptTag.setAttribute('issue-term', 'pathname')
        scriptTag.setAttribute('label', 'Comment')
        scriptTag.setAttribute('theme', isDark.value ? 'github-dark' : 'github-light')
        scriptTag.setAttribute('crossorigin', 'anonymous')
        scriptTag.setAttribute('async', 'async')
        this.$el.append(scriptTag)
    }
}
</script>

<style>
.utterances {
    width: 100%;
    margin: 0 !important;
    max-width: 100%;
}
</style>