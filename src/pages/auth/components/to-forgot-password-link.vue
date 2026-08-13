<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button variant="link" class="text-muted-foreground" @click="$router.push('/auth/forgot-password')">
    {{ $t('forgotPassword') }}
  </Button>
</template>
