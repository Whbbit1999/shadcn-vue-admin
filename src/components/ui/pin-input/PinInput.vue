<script setup lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { PinInputRoot, useForwardPropsEmits } from 'reka-ui'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: () => [],
})
const emits = defineEmits<PinInputRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PinInputRoot v-bind="forwarded" :class="cn('flex gap-2 items-center', props.class)">
    <slot />
  </PinInputRoot>
</template>
