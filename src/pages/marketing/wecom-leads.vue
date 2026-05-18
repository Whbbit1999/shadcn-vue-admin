<script setup lang="ts">
import { UserRoundPlus } from 'lucide-vue-next'

import { BasicPage } from '@/components/global-layout'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
</script>

<template>
  <BasicPage title="WeCom Leads" description="Lead management workspace" sticky>
    <Empty class="min-h-[420px] border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <UserRoundPlus class="size-6" />
        </EmptyMedia>
        <EmptyTitle>Lead management is not connected yet</EmptyTitle>
        <EmptyDescription>
          This protected route is reserved for the Marketing V1 leads module.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: true
</route>
