<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core'
import { MenuIcon, Search } from 'lucide-vue-next'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

import CommandChangeTheme from './command-change-theme.vue'
import CommandToPage from './command-to-page.vue'

const open = ref(false)

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey))
      e.preventDefault()
  },
})

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1])
    handleOpenChange()
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
        <Search class="size-4" />
        <span class="text-xs font-semibold text-muted-foreground">Search Menu</span>
      </div>
      <UiKbd>{{ firstKey }} + k</UiKbd>
    </div>

    <UiButton variant="outline" size="icon" class="md:hidden" @click="handleOpenChange">
      <Search />
    </UiButton>

    <UiCommandDialog v-model:open="open">
      <UiCommandInput placeholder="Type a command or search..." />
      <UiCommandList>
        <UiCommandEmpty>
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
        </UiCommandEmpty>

        <CommandToPage @click="handleOpenChange" />
        <UiCommandSeparator />
        <CommandChangeTheme @click="handleOpenChange" />
      </UiCommandList>
    </UiCommandDialog>
  </div>
</template>
