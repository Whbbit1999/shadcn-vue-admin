<script lang="ts" setup>
import { useAuth } from '@/composables/use-auth'

const username = ref('')
const password = ref('')
const { login, loading, error } = useAuth()

function handleLogin() {
  login(username.value, password.value)
}
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <UiCardHeader>
      <UiCardTitle class="text-2xl">
        RAAS Admin Login
      </UiCardTitle>
      <UiCardDescription>
        Enter your credentials to access the dashboard.
      </UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="grid gap-4">
      <div v-if="error" class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
        {{ error }}
      </div>

      <form class="grid gap-4" @submit.prevent="handleLogin">
        <div class="grid gap-2">
          <UiLabel for="username">
            Username
          </UiLabel>
          <UiInput
            id="username"
            v-model="username"
            type="text"
            placeholder="admin"
            required
            autocomplete="username"
          />
        </div>
        <div class="grid gap-2">
          <UiLabel for="password">
            Password
          </UiLabel>
          <UiInput
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="*********"
            autocomplete="current-password"
          />
        </div>

        <UiButton type="submit" class="w-full" :disabled="loading">
          <UiSpinner v-if="loading" class="mr-2" />
          Login
        </UiButton>
      </form>
    </UiCardContent>
  </UiCard>
</template>
