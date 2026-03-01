<script lang="ts" setup>
</script>

<template>
  <UiButton variant="link" class="text-muted-foreground" @click="$router.push('/auth/forgot-password')">
    {{ $t('forgotPasswordPage.forgotPassword') }}
  </UiButton>
</template>
