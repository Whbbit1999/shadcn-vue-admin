<script lang="ts" setup>
import type { Color } from './utils/data'
import { RADII, useConfigStore } from '@/stores/config'
import { Check } from 'lucide-vue-next'
import { colors } from './utils/colors'

defineProps<{
  allColors: Color[]
}>()

const { theme, radius, setRadius, setTheme } = useConfigStore()
</script>

<template>
  <div class="p-4">
    <div class="grid space-y-1">
      <h1 class="font-semibold text-md text-foreground">
        Customize
      </h1>
      <p class="text-xs text-muted-foreground">
        Pick a style and color for your components.
      </p>
    </div>
    <div class="space-y-1.5 pt-6">
      <UiLabel for="color" class="text-xs">
        Color
      </UiLabel>
      <div class="grid grid-cols-3 gap-2 py-1.5">
        <UiButton
          v-for="(color, index) in allColors"
          :key="index"
          variant="outline"
          class="justify-start h-8 px-3"
          :class="
            color === theme
              ? 'border-foreground border-2'
              : ''
          "
          @click="setTheme(color)"
        >
          <span
            class="flex items-center justify-center w-5 h-5 rounded-full shrink-0"
            :style="{ backgroundColor: colors[color][7].rgb }"
          >
            <Check
              v-if="color === theme"
              class="w-3 h-3 text-white"
            />
          </span>
          <span class="ml-2 text-xs capitalize">
            {{ color }}
          </span>
        </UiButton>
      </div>
    </div>
    <div class="space-y-1.5 pt-6">
      <UiLabel for="radius" class="text-xs">
        Radius
      </UiLabel>
      <div class="grid grid-cols-5 gap-2 py-1.5">
        <UiButton
          v-for="(r, index) in RADII"
          :key="index"
          variant="outline"
          class="justify-center h-8 px-3"
          :class="
            r === radius
              ? 'border-foreground border-2'
              : ''
          "
          @click="setRadius(r)"
        >
          <span class="text-xs">
            {{ r }}
          </span>
        </UiButton>
      </div>
    </div>
  </div>
</template>
