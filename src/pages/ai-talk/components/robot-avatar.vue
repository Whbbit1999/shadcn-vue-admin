<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
</script>

<template>
  <Avatar>
    <AvatarImage src="/robot.png" alt="robot" />
    <AvatarFallback>Robot</AvatarFallback>
  </Avatar>
</template>
