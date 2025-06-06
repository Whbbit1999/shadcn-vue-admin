<script lang="ts" setup>
import type { IMessage } from '../types'

import TalkItem from './talk-item.vue'

interface Props {
  talks: IMessage[]
}

defineProps<Props>()
</script>

<template>
  <div class="">
    <TalkItem
      v-for="talk, index in talks" :key="`${index}${talk.content}`"
      :talk="talk"
      class="mb-2"
    />
  </div>
</template>

<style scoped>

</style>
