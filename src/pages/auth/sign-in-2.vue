<script setup lang="ts">
import AuthTitle from './components/auth-title.vue'
import LoginForm from './components/login-form.vue'
</script>

<template>
  <div class="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="relative hidden bg-muted lg:block">
      <img
        src="/placeholder.png"
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.3] dark:grayscale absolute left-0 top-0 "
      >
      <AuthTitle class="absolute z-10 left-8 top-8" />
    </div>

    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <LoginForm class="border-0 shadow-none" />
      </div>
    </div>
  </div>
</template>
