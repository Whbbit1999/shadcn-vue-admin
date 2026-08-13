<script setup lang="ts">
import { ThumbsDownIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" class="p-1">
          <ThumbsDownIcon class="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>It's so bad</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
