<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useColorMode } from '@vueuse/core'

const mode = useColorMode()

const links = [
  {
    name: 'bluesky',
    icon: 'simple-icons:bluesky',
    url: 'https://bsky.app/profile/bitmc.bsky.social',
  },
  {
    name: 'github',
    icon: 'simple-icons:github',
    url: 'https://github.com/apollosuite/apollo-raas-admin-fe',
  },
  {
    name: 'bilibili',
    icon: 'simple-icons:bilibili',
    url: 'https://space.bilibili.com/104376935',
  },
]
</script>

<template>
  <footer class="min-h-18 flex items-center justify-between">
    <UiAvatar>
      <UiAvatarImage :src="`${mode === 'dark' ? '/logo.svg' : '/logo-black.svg'}`" alt="Logo" />
    </UiAvatar>

    <div>© 2026 Apollo Admin</div>

    <div class="flex items-center gap-2">
      <UiButton
        v-for="link in links"
        :key="link.name"
        variant="outline"
        size="icon"
        as="a"
        :href="link.url"
        target="_blank"
      >
        <Icon :icon="link.icon" />
      </UiButton>
    </div>
  </footer>
</template>
