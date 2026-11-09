<script setup lang="ts">
import { PaintbrushIcon } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import AsideVariant from './aside-variant.vue'
import ContentLayout from './content-layout.vue'
import CustomColor from './custom-color.vue'
import CustomRadius from './custom-radius.vue'
import CustomThemeTitle from './custom-theme-title.vue'
import MenuStyle from './menu-style.vue'
import ToggleColorMode from './toggle-color-mode.vue'
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="outline" size="icon-sm">
        <PaintbrushIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="max-h-(--reka-popover-content-available-height) overflow-y-auto">
      <CustomThemeTitle />
      <CustomColor />
      <CustomRadius />
      <ToggleColorMode />
      <ContentLayout />
      <AsideVariant />
      <MenuStyle />
    </PopoverContent>
  </Popover>
</template>
