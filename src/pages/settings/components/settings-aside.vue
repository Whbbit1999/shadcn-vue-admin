<script setup lang="ts">
import { BellDot, ChevronsUpDown, Palette, PictureInPicture2, User, Wrench } from 'lucide-vue-next'

const route = useRoute()
const currentPath = computed(() => route.path)
const activeClass = 'text-primary font-semibold bg-primary/5'
const links = [
  { path: '/settings/', label: 'Profile', icon: h(User) },
  { path: '/settings/account', label: 'Account', icon: h(Wrench) },
  { path: '/settings/appearance', label: 'Appearance', icon: h(Palette) },
  { path: '/settings/notifications', label: 'Notifications', icon: h(BellDot) },
  { path: '/settings/display', label: 'Display', icon: h(PictureInPicture2) },
]

const currentLink = computed(() => links.find(link => link.path === currentPath.value))
</script>

<template>
  <nav class="flex flex-col gap-2">
    <router-link
      v-for="link in links" :key="link.path"
      :to="link.path"
      class="items-center hidden px-2 py-1 rounded-md lg:flex hover:bg-primary/5"
      :class="link.path === currentPath ? activeClass : ''"
    >
      <component :is="link.icon" class="size-4 mr-1" />
      <span>{{ link.label }}</span>
    </router-link>

    <UiDropdownMenu class="lg:hidden">
      <UiDropdownMenuTrigger>
        <div class="flex items-center w-48 px-2 py-1 border rounded-md lg:hidden hover:bg-primary/5 border-primary/4">
          <component :is="currentLink?.icon" class="size-4 mr-1" />
          <span>{{ currentLink?.label }}</span>
          <ChevronsUpDown class="size-4 ml-auto" />
        </div>
      </UiDropdownMenuTrigger>
      <UiDropdownMenuContent class="w-48" align="start">
        <UiDropdownMenuItem
          v-for="link in links" :key="link.path"
          @click="$router.push(link.path)"
        >
          <component :is="link.icon" class="size-4 mr-1" />
          {{ link.label }}
        </UiDropdownMenuItem>
      </UiDropdownMenuContent>
    </UiDropdownMenu>
  </nav>
</template>

<style scoped>
</style>
