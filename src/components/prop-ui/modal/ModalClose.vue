<script lang="ts" setup>
import type { DialogCloseProps } from 'reka-ui'
import type { DrawerCloseProps } from 'vaul-vue'

import { useModal } from './use-modal'

type Props = DrawerCloseProps | DialogCloseProps

const props = defineProps<Props>()

const { Modal } = useModal()
</script>

<template>
  <component
    :is="Modal.Close"
    v-bind="props"
  >
    <slot />
  </component>
</template>
