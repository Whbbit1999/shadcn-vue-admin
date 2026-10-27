<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { ModalDescription, ModalHeader, ModalTitle } from '@/components/prop-ui/modal'

import type { User } from '../data/schema'

import UserForm from './user-form.vue'

const props = defineProps<{
  user?: User
}>()
const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()

const user = computed(() => props.user)
const title = computed(() => user.value?.id ? t('users.edit.title') : t('users.create.title'))
const description = computed(() => user.value?.id ? t('users.edit.description', { username: user.value.username }) : t('users.create.description'))
</script>

<template>
  <div>
    <ModalHeader>
      <ModalTitle>
        {{ title }}
      </ModalTitle>
      <ModalDescription>
        {{ description }}
      </ModalDescription>
    </ModalHeader>

    <UserForm :user="user" @close="emit('close')" />
  </div>
</template>
