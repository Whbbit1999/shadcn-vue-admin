<script lang='ts' setup>
import { FolderOpenIcon } from 'lucide-vue-next'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FolderOpenIcon />
      </EmptyMedia>
      <EmptyTitle>No result found.</EmptyTitle>
      <EmptyDescription>
        Please try a different search term or check the spelling.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
</template>
