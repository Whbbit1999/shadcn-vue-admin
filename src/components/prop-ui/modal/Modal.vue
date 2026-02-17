<script lang="ts" setup>
import type { DialogRootProps } from 'reka-ui'
import type { DrawerRootProps } from 'vaul-vue'

import { useForwardPropsEmits } from 'reka-ui'

import { useModal } from './use-modal'

type Props = DrawerRootProps | DialogRootProps

const props = defineProps<Props>()
const emits = defineEmits<{
  'update:open': [value: boolean]
}>()

const forwarded = useForwardPropsEmits(props, emits)

const { Modal } = useModal()
</script>

<template>
  <component
    :is="Modal.Root"
    v-bind="forwarded"
  >
    <slot />
  </component>
</template>
