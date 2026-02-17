<script lang="ts" setup>
import type { DialogTriggerProps } from 'reka-ui'
import type { DrawerTriggerProps } from 'vaul-vue'

import { useModal } from './use-modal'

type Props = DialogTriggerProps | DrawerTriggerProps

const props = defineProps<Props>()

const { Modal } = useModal()
</script>

<template>
  <component
    :is="Modal.Trigger"
    v-bind="props"
  >
    <slot />
  </component>
</template>
