<script lang="ts" setup>
import { useModal } from '@/composables/use-modal'

import type { User } from '../data/schema'

import UserForm from './user-form.vue'

const props = defineProps<{
  user?: User
}>()
defineEmits(['close'])

const user = computed(() => props.user)
const title = computed(() => user.value?.id ? `Edit User` : 'New User')
const description = computed(() => user.value?.id ? `Edit user ${user.value.username}` : 'Create new user')
const { Modal } = useModal()
</script>

<template>
  <div>
    <component :is="Modal.Header">
      <component :is="Modal.Title">
        {{ title }}
      </component>
      <component :is="Modal.Description">
        {{ description }}
      </component>
    </component>

    <UserForm :user="user" @close="$emit('close')" />
  </div>
</template>
