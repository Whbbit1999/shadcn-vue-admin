<script setup lang="ts">
import { useConfigStore } from '@/stores/config'
import { Paintbrush } from 'lucide-vue-next'
import { onMounted, watch } from 'vue'
import ThemeCustomizer from './theme-customizer.vue'
import { allColors } from './utils/data'

const { theme, radius } = useConfigStore()

// Whenever the component is mounted, update the document class list
onMounted(() => {
  document.documentElement.style.setProperty('--radius', `${radius.value}rem`)
  document.documentElement.classList.add(`theme-${theme.value}`)
})

// Whenever the theme value changes, update the document class list
watch(theme, (theme) => {
  document.documentElement.classList.remove(
    ...allColors.map(color => `theme-${color}`),
  )
  document.documentElement.classList.add(`theme-${theme}`)
})

// Whenever the radius value changes, update the document style
watch(radius, (radius) => {
  document.documentElement.style.setProperty('--radius', `${radius}rem`)
})
</script>

<template>
  <UiPopover>
    <UiPopoverTrigger as-child>
      <UiButton
        class="w-9 h-9"
        variant="outline"
        size="icon"
      >
        <Paintbrush class="w-4 h-4" />
      </UiButton>
    </UiPopoverTrigger>
    <UiPopoverContent :side-offset="8" align="end" class="w-96">
      <ThemeCustomizer :all-colors="allColors" />
    </UiPopoverContent>
  </UiPopover>
</template>
