<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const storedLocale = useStorage('app-locale', 'en')

function handleLocaleChange(val: string) {
  locale.value = val
  storedLocale.value = val
}
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton variant="outline" class="w-28 justify-center">
        <Icon icon="mdi:translate" class="mr-2" />
        {{ $t('language') }}
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent class="w-28">
      <UiDropdownMenuLabel>{{ $t('changeLanguage') }}</UiDropdownMenuLabel>
      <UiDropdownMenuSeparator />
      <UiDropdownMenuRadioGroup
        v-model="locale"
        @update:model-value="handleLocaleChange"
      >
        <UiDropdownMenuRadioItem value="en">
          <Icon icon="flag:us-4x3" />
          <span class="ml-2">English</span>
        </UiDropdownMenuRadioItem>
        <UiDropdownMenuRadioItem value="zh">
          <Icon icon="flag:cn-4x3" />
          <span class="ml-2">中文</span>
        </UiDropdownMenuRadioItem>
      </UiDropdownMenuRadioGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
