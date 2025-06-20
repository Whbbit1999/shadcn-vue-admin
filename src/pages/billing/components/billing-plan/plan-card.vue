<script lang="ts" setup>
import { BadgeCheck } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  title: string
  description: string

  billingCycle?: string
  billingPeriod?: string

  price: number
  discount?: number

  features: string[]
  buttonLabel: string

  active?: boolean
}
defineProps<Props>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        <h2>{{ title }}</h2>
      </CardTitle>
      <CardDescription>
        {{ description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <div class="flex items-center gap-1 mb-2 text-xs">
        <span v-if="discount" class="text-xl line-through text-muted-foreground">${{ discount }}</span>
        <span class="text-3xl font-bold text-primary">${{ price }}</span>
        <div class="text-muted-foreground">
          <span>/</span>
          <span>{{ billingCycle }}</span>
        </div>
      </div>
      <div
        v-for="(feature, index) in features" :key="feature + index"
        class="flex items-center gap-3 mb-2 text-muted-foreground"
      >
        <BadgeCheck class="size-5 text-primary" />
        {{ feature }}
      </div>
    </CardContent>

    <CardFooter>
      <Button class="w-full" :variant="!active ? 'default' : 'secondary'">
        {{ buttonLabel }}
      </Button>
    </CardFooter>
  </Card>
</template>

<style>

</style>
