<script lang="ts" setup>
import { UserRoundPlus } from 'lucide-vue-next'

import UserResource from './user-resource.vue'

const isOpen = ref(false)
</script>

<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton>
        Create User
        <UserRoundPlus />
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent>
      <UserResource @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>

</style>
