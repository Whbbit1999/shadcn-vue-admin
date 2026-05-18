<script setup lang="ts">
const router = useRouter()
router.replace('/marketing/wecom-customers')
</script>

<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <div class="text-muted-foreground">
      Redirecting...
    </div>
  </div>
</template>

<route lang="yml">
meta:
  auth: true
</route>
