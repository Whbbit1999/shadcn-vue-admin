<script lang="ts" setup>
import { ArrowUpRightIcon, BadgeCheckIcon, ChevronRightIcon } from '@lucide/vue'

import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'

const components = [
  {
    title: 'Copy',
    description: 'Copy button component, supports custom styles and tooltip text.',
    link: 'https://kit.prop.show/en/components/copy',
  },
  {
    title: 'Full Screen Dialog',
    description: '',
    link: 'https://kit.prop.show/en/components/full-screen-dialog',
  },
  {
    title: 'Inline Tip',
    description: 'Inline tip component, used to display different types of tip information.',
    link: 'https://kit.prop.show/en/components/inline-tip',
  },
  {
    title: 'Status Badge',
    description: '',
    link: 'https://kit.prop.show/en/components/status-badge',
  },
]
</script>

<template>
  <BasicPage
    title="Prop Components"
    description="A collection of extended components for shadcn-vue."
    sticky
  >
    <div class="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
      <Item v-for="component in components" :key="component.title" variant="outline">
        <ItemContent>
          <ItemTitle>{{ component.title }}</ItemTitle>
          <ItemDescription>
            {{ component.description }}
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
              Docs
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
            <ItemTitle>More components from kit.prop.show</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon class="size-4" />
          </ItemActions>
        </a>
      </Item>
    </div>
  </BasicPage>
</template>
