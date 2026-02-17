<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { useModal } from './use-modal'

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const { Modal } = useModal()
</script>

<template>
  <component
    :is="Modal.Header"
    v-bind="props"
  >
    <slot />
  </component>
</template>
