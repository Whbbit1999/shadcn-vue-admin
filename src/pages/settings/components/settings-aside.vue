<script setup lang="ts">
import { ChevronsUpDownIcon } from '@lucide/vue'

import { useSidebar } from '@/composables/use-sidebar'

const route = useRoute()
const currentPath = computed(() => route.path)
const activeClass = 'text-primary font-semibold bg-primary/5'

const { settingsNavItems } = useSidebar()
const currentLink = computed(() => settingsNavItems.find(link => link.url === currentPath.value))
</script>

<template>
  <nav class="flex flex-col gap-2">
    <router-link
      v-for="link in settingsNavItems" :key="link.url"
      :to="link.url"
      class="items-center hidden px-2 py-1 rounded-md lg:flex hover:bg-primary/5"
      :class="link.url === currentPath ? activeClass : ''"
    >
      <component :is="link.icon" class="size-4 mr-1" />
      <span>{{ link.title }}</span>
    </router-link>

    <UiDropdownMenu class="lg:hidden">
      <UiDropdownMenuTrigger as-child>
        <UiButton variant="outline" class="w-48 lg:hidden">
          <component :is="currentLink?.icon" class="size-4 mr-1" />
          <span>{{ currentLink?.title }}</span>
          <ChevronsUpDownIcon class="size-4 ml-auto" />
        </UiButton>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent class="w-48" align="start">
        <UiDropdownMenuItem
          v-for="link in settingsNavItems" :key="link.url"
          @click="$router.push(link.url)"
        >
          <component :is="link.icon" class="size-4 mr-1" />
          {{ link.title }}
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </nav>
</template>
