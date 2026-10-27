<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import OverviewChart from './overview-chart.vue'
import RecentSales from './recent-sales.vue'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle class="text-sm font-medium">
          {{ $t('dashboard.stats.totalRevenue') }}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="size-4 text-muted-foreground"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          $45,231.89
        </div>
        <p class="text-xs text-muted-foreground">
          {{ $t('dashboard.stats.changeFromLastMonth', { percent: '20.1' }) }}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle class="text-sm font-medium">
          {{ $t('dashboard.stats.subscriptions') }}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="size-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          +2350
        </div>
        <p class="text-xs text-muted-foreground">
          {{ $t('dashboard.stats.changeFromLastMonth', { percent: '180.1' }) }}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle class="text-sm font-medium">
          {{ $t('dashboard.stats.sales') }}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="size-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          +12,234
        </div>
        <p class="text-xs text-muted-foreground">
          {{ $t('dashboard.stats.changeFromLastMonth', { percent: '19' }) }}
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle class="text-sm font-medium">
          {{ $t('dashboard.stats.activeNow') }}
        </CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          class="size-4 text-muted-foreground"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">
          +573
        </div>
        <p class="text-xs text-muted-foreground">
          {{ $t('dashboard.stats.changeSinceLastHour', { count: '201' }) }}
        </p>
      </CardContent>
    </Card>
  </div>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-7">
    <OverviewChart class="col-span-1 lg:col-span-4" />
    <Card class="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>{{ $t('dashboard.recentSales.title') }}</CardTitle>
        <CardDescription>
          {{ $t('dashboard.recentSales.description', { count: 265 }) }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentSales />
      </CardContent>
    </Card>
  </div>
</template>
