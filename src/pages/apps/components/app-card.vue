<script setup lang="ts">
import type { IApp } from '../type'

defineProps<{ app: IApp }>()
</script>

<template>
  <UiCard class="relative">
    <UiCardHeader>
      <div class="flex items-center justify-between">
        <div
          class="flex items-center justify-center p-2 rounded-lg size-10 bg-muted"
        >
          <component :is="app.logo" />
        </div>
        <UiButton
          :variant="app.connected ? 'secondary' : 'outline'"
          size="sm"
        >
          {{ app.connected ? 'Connected' : 'Connect' }}
        </UiButton>
      </div>
    </UiCardHeader>
    <UiCardContent>
      <UiCardTitle>
        {{ app.name }}
      </UiCardTitle>
      <UiCardDescription class="mt-2">
        {{ app.desc }}
      </UiCardDescription>
    </UiCardContent>
  </UiCard>
</template>
