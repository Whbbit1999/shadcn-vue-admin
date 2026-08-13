<script setup lang="ts">
import { RefreshCcwIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" class="p-1">
          <RefreshCcwIcon class="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>refresh</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
