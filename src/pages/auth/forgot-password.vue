<script setup lang="ts">
import AuthTitle from './components/auth-title.vue'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <UiCard>
        <UiCardHeader>
          <UiCardTitle class="text-2xl">
            Forgot Password
          </UiCardTitle>
          <UiCardDescription>
            Enter your registered email and we will send you a link to reset your password.
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="grid gap-4">
          <div class="grid gap-2">
            <UiLabel for="email">
              Email
            </UiLabel>
            <UiInput id="email" type="email" placeholder="m@example.com" required />
          </div>
        </UiCardContent>
        <UiCardFooter class="flex flex-col gap-2">
          <UiButton class="w-full">
            Continue
          </UiButton>

          <div>
            Don't have an account?
            <UiButton
              variant="link" class="px-0 text-muted-foreground"
              @click="$router.push('/auth/sign-up')"
            >
              Sign up.
            </UiButton>
          </div>
        </UiCardFooter>
      </UiCard>
    </main>
  </div>
</template>
