<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import AuthTitle from './components/auth-title.vue'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your registered email and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">
              {{ $t('email') }}
            </Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button class="w-full">
            {{ $t('forgotPasswordPage.continue') }}
          </Button>

          <div>
            Don't have an account?
            <Button
              variant="link" class="px-0 text-muted-foreground"
              @click="$router.push('/auth/sign-up')"
            >
              Sign up.
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  </div>
</template>
