<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button as="a" href="/auth/sign-in">
    {{ $t('login') }}
  </Button>
</template>
