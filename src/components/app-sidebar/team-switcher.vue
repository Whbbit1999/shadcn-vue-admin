<script setup lang="ts">
import { ChevronsUpDownIcon, PlusIcon } from '@lucide/vue'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

import type { Team } from './types'

const { teams } = defineProps<{
  teams: Team[]
}>()

const { isMobile, open } = useSidebar()

const activeTeam = ref<Team>(teams[0])
function setActiveTeam(team: Team) {
  activeTeam.value = team
}

const isOpen = shallowRef(false)

const showComponent = shallowRef<Component | null>(null)
type TComponent = 'team-add'

function handleSelect(command: TComponent) {
  switch (command) {
    case 'team-add':
      showComponent.value = defineAsyncComponent(() => import('./nav-team-add.vue'))
      break
  }
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <Dialog v-model:open="isOpen">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton
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
              <ChevronsUpDownIcon class="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            :side="(isMobile || open) ? 'bottom' : 'right'"
            :side-offset="4"
          >
            <DropdownMenuLabel class="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            <DropdownMenuItem
              v-for="(team, index) in teams"
              :key="team.name"
              class="gap-2 p-2"
              @click="setActiveTeam(team)"
            >
              <div class="flex items-center justify-center border rounded-sm size-6">
                <component :is="team.logo" class="size-4 shrink-0" />
              </div>
              {{ team.name }}
              <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DialogTrigger as-child>
              <DropdownMenuItem class="gap-2 p-2" @click.stop="handleSelect('team-add')">
                <div class="flex items-center justify-center border rounded-md size-6 bg-background">
                  <PlusIcon class="size-4" />
                </div>
                <div class="font-medium text-muted-foreground">
                  Add team
                </div>
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <component :is="showComponent" @close="isOpen = false" />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
