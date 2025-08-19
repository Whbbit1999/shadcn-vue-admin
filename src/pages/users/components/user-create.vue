<script lang="ts" setup>
import { UserRoundPlus } from 'lucide-vue-next'

import UserResource from './user-resource.vue'

const isOpen = ref(false)
</script>

<template>
  <UiDialog v-model:open="isOpen">
    <UiDialogTrigger as-child>
      <UiButton>
        <UserRoundPlus />
        Create User
      </UiButton>
    </UiDialogTrigger>

    <UiDialogContent class="max-h-[500px] overflow-y-auto">
      <UserResource @close="isOpen = false" />
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>

</style>
