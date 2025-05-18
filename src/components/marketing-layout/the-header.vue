<script lang="ts" setup>
import { useColorMode } from '@vueuse/core'

import LanguageChange from '@/components/language-change.vue'
import SignInButton from '@/components/sign-in-button.vue'
import SignUpButton from '@/components/sign-up-button.vue'
import ToggleTheme from '@/components/toggle-theme.vue'

const mode = useColorMode()
</script>

<template>
  <header class="h-14 flex items-center marketing-header sticky top-0 z-99">
    <router-link to="/" class="flex items-center gap-2">
      <UiAvatar>
        <UiAvatarImage :src="`${mode === 'dark' ? '/logo.svg' : '/logo-black.svg'}`" alt="Logo" />
      </UiAvatar>
      <span class="text-base font-bold">Shadcn Vue Admin</span>
    </router-link>

    <div class="flex-1" />

    <div class="mr-2 hidden lg:flex lg:gap-2">
      <SignInButton />
      <SignUpButton />
    </div>

    <div class="flex gap-2">
      <LanguageChange />
      <ToggleTheme />
    </div>
  </header>
</template>

<style scoped>
.marketing-header {
  backdrop-filter: saturate(50%) blur(4px);
  background-size: 4px 4px;
}
</style>
