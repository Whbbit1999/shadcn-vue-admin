<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
</script>

<template>
  <Avatar>
    <AvatarImage src="/robot.png" :alt="$t('aiTalk.robot.alt')" />
    <AvatarFallback>{{ $t('aiTalk.robot.name') }}</AvatarFallback>
  </Avatar>
</template>
