<script setup lang="ts">
import { VisArea, VisAxis, VisLine, VisXYContainer } from '@unovis/vue'
import { useI18n } from 'vue-i18n'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  componentToString,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import type { OverviewChartData } from './overview-chart.data'

import { chartColors, chartData, createChartConfig, overviewChartSvgDefs } from './overview-chart.data'

const { t } = useI18n()

const chartConfig = computed(() => createChartConfig(key => t(key)))

const timeRanges = [
  { value: '90d', labelKey: 'dashboard.chart.ranges.last3Months' },
  { value: '30d', labelKey: 'dashboard.chart.ranges.last30Days' },
  { value: '7d', labelKey: 'dashboard.chart.ranges.last7Days' },
]

const timeRange = shallowRef('90d')
const filterRange = computed(() => {
  return chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange.value === '30d') {
      daysToSubtract = 30
    }
    else if (timeRange.value === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })
})

// Hoisted out of the template: vue-tsc (3.3.13) mis-emits `.value` for identifiers
// indexed inline inside template prop expressions.
const lineColor = (_d: OverviewChartData, i: number) => [chartColors.mobile, chartColors.desktop][i]
const crosshairColor = (_d: OverviewChartData, i: number) => [chartColors.mobile, chartColors.desktop][i % 2]
</script>

<template>
  <Card class="pt-0">
    <CardHeader class="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
      <div class="grid flex-1 gap-1">
        <CardTitle>{{ $t('dashboard.chart.title') }}</CardTitle>
        <CardDescription>
          {{ $t('dashboard.chart.description') }}
        </CardDescription>
      </div>
      <Select v-model="timeRange">
        <SelectTrigger
          class="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
          :aria-label="$t('dashboard.chart.selectRange')"
        >
          <SelectValue :placeholder="$t('dashboard.chart.ranges.last3Months')" />
        </SelectTrigger>
        <SelectContent class="rounded-xl">
          <SelectItem
            v-for="range in timeRanges"
            :key="range.value"
            :value="range.value"
            class="rounded-lg"
          >
            {{ $t(range.labelKey) }}
          </SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent class="px-2 pt-4 sm:px-6 sm:pt-6 pb-4">
      <ChartContainer :config="chartConfig" class="aspect-auto h-[250px] w-full" :cursor="false">
        <VisXYContainer
          :data="filterRange"
          :svg-defs="overviewChartSvgDefs"
          :margin="{ left: -40 }"
          :y-domain="[0, 1200]"
        >
          <VisArea
            :x="(d: OverviewChartData) => d.date"
            :y="[(d: OverviewChartData) => d.mobile, (d: OverviewChartData) => d.desktop]"
            :color="(_d: OverviewChartData, i: number) => ['url(#fillMobile)', 'url(#fillDesktop)'][i]"
            :opacity="0.6"
          />
          <VisLine
            :x="(d: OverviewChartData) => d.date"
            :y="[(d: OverviewChartData) => d.mobile, (d: OverviewChartData) => d.mobile + d.desktop]"
            :color="lineColor"
            :line-width="1"
          />
          <VisAxis
            type="x"
            :x="(d: OverviewChartData) => d.date"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-format="(d: number, _index: number) => {
              const date = new Date(d)
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            }"
          />
          <VisAxis
            type="y"
            :num-ticks="3"
            :tick-line="false"
            :domain-line="false"
          />
          <ChartTooltip />
          <ChartCrosshair
            :template="componentToString(chartConfig, ChartTooltipContent, {
              labelFormatter: (d) => {
                return new Date(d).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              },
            })"
            :color="crosshairColor"
          />
        </VisXYContainer>

        <ChartLegendContent />
      </ChartContainer>
    </CardContent>
  </Card>
</template>
