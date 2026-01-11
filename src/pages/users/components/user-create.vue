<script lang="ts" setup>
import { UserRoundPlus } from 'lucide-vue-next'

import { useModal } from '@/composables/use-modal'

import UserResource from './user-resource.vue'

const isOpen = ref(false)
const { Modal, contentClass } = useModal()
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component :is="Modal.Trigger" as-child>
      <UiButton>
        <UserRoundPlus />
        Create User
      </UiButton>
    </component>

    <component
      :is="Modal.Content" :class="contentClass"
    >
      <UserResource @close="isOpen = false" />
    </component>
  </component>
</template>
