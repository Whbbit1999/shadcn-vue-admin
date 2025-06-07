<script setup lang="ts">
import AuthTitle from './components/auth-title.vue'

const value = ref<string[]>([])
function handleComplete(e: string[]) {
  // eslint-disable-next-line no-alert
  alert(e.join(''))
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <UiCard class="w-full max-w-sm">
        <UiCardHeader>
          <UiCardTitle class="text-2xl">
            Two-Factor Authentication
          </UiCardTitle>
          <UiCardDescription>
            Please enter the authentication code.We have sent the authentication code to your email.
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent class="grid gap-4">
          <div class="grid items-center justify-center gap-2">
            <UiPinInput
              id="pin-input"
              v-model="value"
              placeholder="○"
              @complete="handleComplete"
            >
              <span class="text-xl">SA</span>
              <span>-</span>
              <UiPinInputGroup>
                <UiPinInputInput
                  v-for="(id, index) in 6"
                  :key="id"
                  :index="index"
                />
              </UiPinInputGroup>
            </UiPinInput>
          </div>
        </UiCardContent>
        <UiCardFooter class="flex flex-col gap-2">
          <UiButton class="w-full" :disabled="value.length < 6">
            Verify
          </UiButton>

          <UiCardDescription>
            Haven't received it?
            <UiButton variant="link" class="px-0 text-muted-foreground">
              Resend a new code.
            </UiButton>
          </UiCardDescription>
        </UiCardFooter>
      </UiCard>
    </main>
  </div>
</template>
