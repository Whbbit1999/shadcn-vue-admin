<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface User {
  avatar: string
  name: string
  email: string
  amount: string
}

const list = ref<User[]>([
  { avatar: '', name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '$1,999.00' },
  { avatar: '', name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '$39.00' },
  { avatar: '', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '$299.00' },
  { avatar: '', name: 'William Kim', email: 'will@email.com', amount: '$99.00' },
  { avatar: '', name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '$39.00' },
])
</script>

<template>
  <div class="space-y-8">
    <div v-for="item in list" :key="item.name" class="flex items-center gap-4">
      <Avatar class-name="h-9 w-9">
        <AvatarImage :src="item.avatar" alt="Avatar" />
        <AvatarFallback>{{ item.name[0].toUpperCase() }}</AvatarFallback>
      </Avatar>
      <div class="flex flex-wrap items-center justify-between flex-1">
        <div class="space-y-1">
          <p class="text-sm font-medium leading-none">
            {{ item.name }}
          </p>
          <p class="text-sm text-muted-foreground">
            {{ item.email }}
          </p>
        </div>
        <div class="font-medium">
          {{ item.amount }}
        </div>
      </div>
    </div>
  </div>
</template>
