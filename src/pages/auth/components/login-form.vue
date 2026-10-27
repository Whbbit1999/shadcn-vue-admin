<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/composables/use-auth'

import GitHubButton from './github-button.vue'
import GoogleButton from './google-button.vue'
import PrivacyPolicyButton from './privacy-policy-button.vue'
import TermsOfServiceButton from './terms-of-service-button.vue'
import ToForgotPasswordLink from './to-forgot-password-link.vue'

const { login, loading } = useAuth()
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        {{ $t('login') }}
      </CardTitle>
      <CardDescription>
        {{ $t('auth.loginDescription') }}
        {{ $t('auth.noAccount') }}
        <Button
          variant="link" class="px-0 text-muted-foreground"
          @click="$router.push('/auth/sign-up')"
        >
          {{ $t('auth.signUp') }}
        </Button>
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">
          {{ $t('email') }}
        </Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <Label for="password">
            {{ $t('password') }}
          </Label>
          <ToForgotPasswordLink />
        </div>
        <Input id="password" type="password" required placeholder="*********" />
      </div>

      <Button class="w-full" @click="login">
        <Spinner v-if="loading" class="mr-2" />
        {{ $t('login') }}
      </Button>

      <Separator :label="$t('auth.orContinueWith')" />

      <div class="flex flex-col items-center justify-between gap-4">
        <GitHubButton />
        <GoogleButton />
      </div>

      <CardDescription>
        {{ $t('auth.agreeToLogin') }}
        <TermsOfServiceButton />
        {{ $t('auth.and') }}
        <PrivacyPolicyButton />
      </CardDescription>
    </CardContent>
  </Card>
</template>
