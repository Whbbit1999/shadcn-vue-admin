<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input'

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
      <Card class="w-full max-w-sm">
        <CardHeader>
          <CardTitle class="text-2xl">
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Please enter the authentication code.We have sent the authentication code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid items-center justify-center gap-2">
            <PinInput
              id="pin-input"
              v-model="value"
              placeholder="○"
              @complete="handleComplete"
            >
              <span class="text-xl">SA</span>
              <span>-</span>
              <PinInputGroup>
                <PinInputInput
                  v-for="(id, index) in 6"
                  :key="id"
                  :index="index"
                />
              </PinInputGroup>
            </PinInput>
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button class="w-full" :disabled="value.length < 6">
            Verify
          </Button>

          <CardDescription>
            Haven't received it?
            <Button variant="link" class="px-0 text-muted-foreground">
              Resend a new code.
            </Button>
          </CardDescription>
        </CardFooter>
      </Card>
    </main>
  </div>
</template>
