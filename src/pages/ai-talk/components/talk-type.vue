<script lang="ts" setup>
import { RadioTowerIcon, SparklesIcon } from '@lucide/vue'

const emit = defineEmits(['update:type'])

const type = ref('deep-think')

const types = [
  { type: 'deep-think', icon: SparklesIcon },
  { type: 'online', icon: RadioTowerIcon },
]

watch(type, () => {
  emit('update:type', type.value)
}, { immediate: true })
</script>

<template>
  <UiToggleGroup v-model="type" type="single" variant="outline" size="sm">
    <UiToggleGroupItem v-for="modelType in types" :key="modelType.type" class="px-4" :value="modelType.type" :aria-label="modelType.type">
      <component :is="modelType.icon" class="size-4 mr-1" />
      {{ modelType.type }}
    </UiToggleGroupItem>
  </UiToggleGroup>
</template>
