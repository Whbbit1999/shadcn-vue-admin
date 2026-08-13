<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RADIUS } from '@/constants/themes'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { setRadius } = themeStore
const { radius } = storeToRefs(themeStore)
</script>

<template>
  <div class="space-y-1.5 pt-6">
    <Label for="radius" class="text-xs">
      Radius
    </Label>
    <div class="grid grid-cols-5 gap-2 py-1.5">
      <Button
        v-for="rayon in RADIUS" :key="rayon"
        variant="outline"
        class="justify-center h-8 px-3"
        :class="rayon === radius ? 'border-foreground border-2' : ''"
        @click="setRadius(rayon)"
      >
        <span class="text-xs">{{ rayon }}</span>
      </Button>
    </div>
  </div>
</template>
