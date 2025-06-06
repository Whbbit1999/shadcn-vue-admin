<script lang="ts" setup>
import type { User } from '../data/schema'

import UserForm from './user-form.vue'

const props = defineProps<{
  user?: User
}>()
defineEmits(['close'])

const user = computed(() => props.user)
const title = computed(() => user.value?.id ? `Edit User` : 'New User')
const description = computed(() => user.value?.id ? `Edit user ${user.value.username}` : 'Create new user')
</script>

<template>
  <div>
    <UiDialogHeader>
      <UiDialogTitle>
        {{ title }}
      </UiDialogTitle>
      <UiDialogDescription>
        {{ description }}
      </UiDialogDescription>
    </UiDialogHeader>
    <UserForm class="mt-2" :user="user" @close="$emit('close')" />
  </div>
</template>

<style scoped>

</style>
