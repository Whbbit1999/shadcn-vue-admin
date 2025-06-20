<script lang="ts" setup>
import { RadioTower, Sparkles } from 'lucide-vue-next'

const emit = defineEmits(['update:type'])

const type = ref('deep-think')

const types = [
  { type: 'deep-think', icon: Sparkles },
  { type: 'online', icon: RadioTower },
]

watch(type, () => {
  emit('update:type', type.value)
}, { immediate: true })
</script>

<template>
  <UiToggleGroup v-model="type" type="single" variant="outline">
    <UiToggleGroupItem v-for="modelType in types" :key="modelType.type" class="px-4" :value="modelType.type" :aria-label="modelType.type">
      <component :is="modelType.icon" class="size-4 mr-1" />
      {{ modelType.type }}
    </UiToggleGroupItem>
  </UiToggleGroup>
</template>

<style scoped>

</style>
