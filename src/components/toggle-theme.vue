<script setup lang="ts">
import { MoonIcon, SunIcon, SunMoonIcon } from '@lucide/vue'
import { useColorMode } from '@vueuse/core'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const mode = useColorMode()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="icon-sm"
        :aria-label="$t('theme.toggle')"
        :title="$t('theme.toggle')"
      >
        <SunIcon class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">{{ $t('theme.toggle') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="mode = 'light'">
        <SunIcon />
        {{ $t('theme.light') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'dark'">
        <MoonIcon />
        {{ $t('theme.dark') }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="mode = 'auto'">
        <SunMoonIcon />
        {{ $t('theme.system') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
