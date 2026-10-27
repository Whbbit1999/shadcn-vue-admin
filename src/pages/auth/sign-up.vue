<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import AuthTitle from './components/auth-title.vue'
import GitHubButton from './components/github-button.vue'
import GoogleButton from './components/google-button.vue'
import PrivacyPolicyButton from './components/privacy-policy-button.vue'
import TermsOfServiceButton from './components/terms-of-service-button.vue'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen p-4 min-w-screen">
    <main class="flex flex-col gap-4">
      <AuthTitle />
      <Card class="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle class="text-xl">
            {{ $t('auth.signUp') }}
          </CardTitle>
          <CardDescription>
            {{ $t('auth.signUpDescription') }}
            {{ $t('auth.haveAccount') }}
            <Button
              variant="link" class="px-0 text-muted-foreground"
              @click="$router.push('/auth/sign-in')"
            >
              {{ $t('auth.signIn') }}
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label for="first-name">
                  {{ $t('auth.firstName') }}
                </Label>
                <Input id="first-name" placeholder="Max" required />
              </div>
              <div class="grid gap-2">
                <Label for="last-name">
                  {{ $t('auth.lastName') }}
                </Label>
                <Input id="last-name" placeholder="Robinson" required />
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="email">
                {{ $t('email') }}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="password">
                {{ $t('password') }}
              </Label>
              <Input id="password" type="password" placeholder="******" />
            </div>
            <div class="grid gap-2">
              <Label for="password">
                {{ $t('auth.confirmPassword') }}
              </Label>
              <Input id="password" type="password" placeholder="******" />
            </div>
            <Button type="submit" class="w-full">
              {{ $t('auth.createAccount') }}
            </Button>

            <Separator :label="$t('auth.orContinueWith')" />

            <div class="flex flex-col items-center justify-between gap-4">
              <GitHubButton />
              <GoogleButton />
            </div>

            <CardDescription>
              {{ $t('auth.agreeToSignUp') }}
              <TermsOfServiceButton />
              {{ $t('auth.and') }}
              <PrivacyPolicyButton />
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </main>
  </div>
</template>
