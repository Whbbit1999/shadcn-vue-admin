<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineProps<{
  code: number
  subtitle: string
  error: string
}>()
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <h1 class="font-bold text-8xl">
      {{ code }}
    </h1>
    <h2 class="mt-4 text-2xl font-bold">
      {{ subtitle }}
    </h2>
    <p class="text-stone-400">
      {{ error }}
    </p>

    <footer class="mt-8">
      <slot>
        <div class="flex justify-center gap-2">
          <Button variant="outline" @click="$router.back()">
            Go Back
          </Button>
          <Button @click="$router.push('/')">
            Back to Home
          </Button>
        </div>
      </slot>
    </footer>
  </div>
</template>
