<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'

import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import type { Language } from '@/plugins/i18n'

import { appLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/plugins/i18n'

const { locale } = useI18n()

function setDefaultLanguage() {
  locale.value = DEFAULT_LOCALE
  appLocale.value = DEFAULT_LOCALE
}

function handleLocaleChange(val: AcceptableValue) {
  if (typeof val !== 'string' || !SUPPORTED_LOCALES.has(val as Language)) {
    setDefaultLanguage()
    return
  }

  locale.value = val as Language
  appLocale.value = val as Language
}
</script>

<template>
  <UiDropdownMenu>
    <UiDropdownMenuTrigger as-child>
      <UiButton variant="outline" size="icon">
        <Icon icon="mdi:translate" />
      </UiButton>
    </UiDropdownMenuTrigger>
    <UiDropdownMenuContent>
      <UiDropdownMenuRadioGroup
        v-model="locale"
        @update:model-value="handleLocaleChange"
      >
        <UiDropdownMenuRadioItem value="en">
          <Icon icon="flag:us-4x3" />
          <span>English</span>
        </UiDropdownMenuRadioItem>
        <UiDropdownMenuRadioItem value="zh">
          <Icon icon="flag:cn-4x3" />
          <span>中文</span>
        </UiDropdownMenuRadioItem>
      </UiDropdownMenuRadioGroup>
    </UiDropdownMenuContent>
  </UiDropdownMenu>
</template>
