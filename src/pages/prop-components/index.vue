<script setup lang="ts">
import { ArrowUpRightIcon, BadgeCheckIcon, ChevronRightIcon } from '@lucide/vue'

import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'

const components = [
  {
    titleKey: 'propComponents.items.copy.title',
    descriptionKey: 'propComponents.items.copy.description',
    link: 'https://kit.prop.show/en/components/copy',
  },
  {
    titleKey: 'propComponents.items.fullScreenDialog.title',
    descriptionKey: 'propComponents.items.fullScreenDialog.description',
    link: 'https://kit.prop.show/en/components/full-screen-dialog',
  },
  {
    titleKey: 'propComponents.items.inlineTip.title',
    descriptionKey: 'propComponents.items.inlineTip.description',
    link: 'https://kit.prop.show/en/components/inline-tip',
  },
  {
    titleKey: 'propComponents.items.statusBadge.title',
    descriptionKey: 'propComponents.items.statusBadge.description',
    link: 'https://kit.prop.show/en/components/status-badge',
  },
]
</script>

<template>
  <BasicPage
    :title="$t('propComponents.title')"
    :description="$t('propComponents.description')"
    sticky
  >
    <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
      <Item v-for="component in components" :key="component.titleKey" variant="outline">
        <ItemContent>
          <ItemTitle>{{ $t(component.titleKey) }}</ItemTitle>
          <ItemDescription>
            {{ $t(component.descriptionKey) }}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm" as-child>
            <a
              :href="component.link"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2"
            >
              {{ $t('common.docs') }}
              <ArrowUpRightIcon />
            </a>
          </Button>
        </ItemActions>
      </Item>

      <Item variant="outline" size="sm" as-child>
        <a href="https://kit.prop.show/en" target="_blank" rel="noopener noreferrer">
          <ItemMedia>
            <BadgeCheckIcon class="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{{ $t('propComponents.more') }}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon class="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  </BasicPage>
</template>
