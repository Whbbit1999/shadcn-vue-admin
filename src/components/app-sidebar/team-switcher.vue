<script lang="ts" setup>
import type { Team } from './types'
import {
  ChevronsUpDown,
  Plus,
} from 'lucide-vue-next'

const { teams } = defineProps<{
  teams: Team[]
}>()

const activeTeam = ref<Team>(teams[0])
function setActiveTeam(team: Team) {
  activeTeam.value = team
}
</script>

<template>
  <UiSidebarMenu>
    <UiSidebarMenuItem>
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiSidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground"
            >
              <component :is="activeTeam.logo" class="size-4" />
            </div>
            <div class="grid flex-1 text-sm leading-tight text-left">
              <span class="font-semibold truncate">{{ activeTeam.name }}</span>
              <span class="text-xs truncate">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </UiSidebarMenuButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent
          class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          align="start"
          side="bottom"
          :side-offset="4"
        >
          <UiDropdownMenuLabel class="text-xs text-muted-foreground">
            Teams
          </UiDropdownMenuLabel>
          <UiDropdownMenuItem
            v-for="(team, index) in teams"
            :key="team.name"
            class="gap-2 p-2"
            @click="setActiveTeam(team)"
          >
            <div class="flex items-center justify-center border rounded-sm size-6">
              <component :is="team.logo" class="size-4 shrink-0" />
            </div>
            {{ team.name }}
            <UiDropdownMenuShortcut>⌘{{ index + 1 }}</UiDropdownMenuShortcut>
          </UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem class="gap-2 p-2">
            <div class="flex items-center justify-center border rounded-md size-6 bg-background">
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">
              Add team
            </div>
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </UiSidebarMenuItem>
  </UiSidebarMenu>
</template>
