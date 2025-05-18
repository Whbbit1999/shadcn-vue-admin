<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

import GlowingEffect from '@/components/inspira-ui/glowing-effect.vue'
import { cn } from '@/lib/utils'

const { t } = useI18n()

const gridItems = computed(() => [
  {
    icon: 'lucide:box',
    title: t('marketing.features.feature1.title'),
    description: t('marketing.features.feature1.description'),
  },
  {
    icon: 'lucide:settings',
    title: t('marketing.features.feature2.title'),
    description: t('marketing.features.feature2.description'),
  },
  {
    icon: 'lucide:sparkles',
    title: t('marketing.features.feature3.title'),
    description: t('marketing.features.feature3.description'),
  },
  {
    icon: 'lucide:search',
    title: t('marketing.features.feature4.title'),
    description: t('marketing.features.feature4.description'),
  },
])
</script>

<template>
  <div>
    <h2 class="text-4xl font-bold text-center mb-8">
      {{ $t('marketing.features.title') }}
    </h2>

    <ul
      class="grid grid-cols-1 grid-rows-none gap-4 overflow-auto xl:max-h-[56rem] xl:grid-rows-2 lg:gap-4 md:grid-cols-2 md:grid-rows-3"
    >
      <li
        v-for="item in gridItems"
        :key="item.title"
        :class="cn('min-h-[14rem] list-none')"
      >
        <div class="rounded-2.5xl relative h-full border p-2 md:rounded-3xl md:p-3">
          <GlowingEffect
            :spread="40"
            :glow="true"
            :disabled="false"
            :proximity="64"
            :inactive-zone="0.01"
          />
          <div
            class="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]"
          >
            <div class="relative flex flex-1 flex-col justify-between gap-3">
              <div class="w-fit rounded-lg border border-gray-600 p-2">
                <Icon
                  class="size-4 text-black dark:text-neutral-500"
                  :icon="item.icon"
                />
              </div>
              <div class="space-y-3">
                <h3
                  class="-tracking-4 text-balance pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-black md:text-2xl/[1.875rem] dark:text-white"
                >
                  {{ item.title }}
                </h3>
                <h2
                  class="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold"
                >
                  {{ item.description }}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>
