<script setup lang="ts">
import { MenuIcon, SearchIcon } from '@lucide/vue'
import { useEventListener } from '@vueuse/core'

import { Button } from '@/components/ui/button'
import { CommandDialog, CommandEmpty, CommandInput, CommandList, CommandSeparator } from '@/components/ui/command'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Kbd } from '@/components/ui/kbd'

import CommandChangeTheme from './command-change-theme.vue'
import CommandToPage from './command-to-page.vue'

const open = shallowRef(false)

useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    handleOpenChange()
  }
})

function handleOpenChange() {
  open.value = !open.value
}

const firstKey = computed(() => navigator?.userAgent.includes('Mac OS') ? '⌘' : 'Ctrl')
</script>

<template>
  <div>
    <div
      class="text-sm items-center justify-between text-muted-foreground border border-border bg-muted/5 px-4 py-2 rounded-md md:min-w-[220px] cursor-pointer hidden md:flex"
      @click="handleOpenChange"
    >
      <div class="flex items-center gap-2">
        <SearchIcon class="size-4" />
        <span class="text-xs font-semibold text-muted-foreground">{{ $t('homePage.searchKeyWords') }}</span>
      </div>
      <Kbd>{{ firstKey }} + k</Kbd>
    </div>

    <Button variant="outline" size="icon" class="md:hidden" @click="handleOpenChange">
      <SearchIcon />
    </Button>

    <CommandDialog v-model:open="open">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MenuIcon />
              </EmptyMedia>
              <EmptyTitle>No menu found.</EmptyTitle>
              <EmptyDescription>
                Try searching for a command or check the spelling.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CommandEmpty>

        <CommandToPage @click="handleOpenChange" />
        <CommandSeparator />
        <CommandChangeTheme @click="handleOpenChange" />
      </CommandList>
    </CommandDialog>
  </div>
</template>
