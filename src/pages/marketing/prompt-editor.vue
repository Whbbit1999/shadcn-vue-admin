<script setup lang="ts">
import { Plus, RefreshCw, Save, Trash2 } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import type { WeComLeadPromptRule } from '@/services/types/marketing.type'

import { BasicPage } from '@/components/global-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useMarketingApi } from '@/services/api/marketing.api'

const sampleTranscript = ref([
  '[2026-05-19 10:00] Apollo Staff apollo-nasa: Hi, thanks for your interest. What problem are you trying to solve?',
  '[2026-05-19 10:04] Customer: We are evaluating a RAG system for internal knowledge search, but budget approval is not clear yet.',
].join('\n'))

const promptForm = ref({
  system_prompt: '',
  user_prompt: '',
  playbook_text: '',
  tag_rules: [] as WeComLeadPromptRule[],
})

const {
  useGetWeComLeadPrompts,
  useSaveWeComLeadPrompts,
} = useMarketingApi()

const promptsQuery = useGetWeComLeadPrompts()
const savePromptsMutation = useSaveWeComLeadPrompts()

watch(() => promptsQuery.data.value, (prompt) => {
  if (!prompt)
    return
  promptForm.value = {
    system_prompt: prompt.system_prompt,
    user_prompt: prompt.user_prompt,
    playbook_text: prompt.playbook_text,
    tag_rules: prompt.tag_rules.map(rule => ({ ...rule })),
  }
}, { immediate: true })

const tagBlockPreview = computed(() => {
  if (promptForm.value.tag_rules.length === 0)
    return ''
  return promptForm.value.tag_rules
    .slice()
    .sort((left, right) => Number(left.id) - Number(right.id))
    .map(rule => [
      `## ${rule.tag_name || `Tag ${rule.id}`}`,
      `标签定义：${rule.tag_desc || ''}`,
      `输出结构（命中）：${rule.output_schema_true || '{}'}`,
      `输出结构（未命中）：${rule.output_schema_false || '{}'}`,
      `补充约束：${rule.output_notes || '无'}`,
    ].join('\n'))
    .join('\n\n')
})

function replaceToken(value: string, token: string, replacement: string) {
  return value.split(token).join(replacement)
}

const renderedSystemPrompt = computed(() => {
  return replaceToken(promptForm.value.system_prompt, '{tag_block}', tagBlockPreview.value)
})

const renderedUserPrompt = computed(() => {
  return replaceToken(
    replaceToken(promptForm.value.user_prompt, '{playbook_text}', promptForm.value.playbook_text),
    '{transcript}',
    sampleTranscript.value,
  )
})

const tagRuleError = computed(() => {
  const ids = new Set<number>()
  for (const rule of promptForm.value.tag_rules) {
    const id = Number(rule.id)
    if (!Number.isInteger(id) || id < 1)
      return 'Every tag rule needs a positive integer ID.'
    if (ids.has(id))
      return 'Tag rule IDs must be unique.'
    ids.add(id)
    if (!rule.tag_name.trim())
      return 'Every tag rule needs a tag name.'
  }
  return ''
})

function nextTagRuleId() {
  const currentIds = promptForm.value.tag_rules.map(rule => Number(rule.id)).filter(Number.isFinite)
  return currentIds.length ? Math.max(...currentIds) + 1 : 1
}

function addTagRule() {
  promptForm.value.tag_rules.push({
    id: nextTagRuleId(),
    tag_name: '',
    tag_desc: '',
    output_schema_true: '',
    output_schema_false: '',
    output_notes: '',
  })
}

function removeTagRule(index: number) {
  promptForm.value.tag_rules.splice(index, 1)
}

function resetFromServer() {
  const prompt = promptsQuery.data.value
  if (!prompt)
    return
  promptForm.value = {
    system_prompt: prompt.system_prompt,
    user_prompt: prompt.user_prompt,
    playbook_text: prompt.playbook_text,
    tag_rules: prompt.tag_rules.map(rule => ({ ...rule })),
  }
}

function savePrompts() {
  if (tagRuleError.value)
    return
  savePromptsMutation.mutate({
    ...promptForm.value,
    tag_rules: promptForm.value.tag_rules.map(rule => ({
      ...rule,
      id: Number(rule.id),
    })),
  })
}
</script>

<template>
  <BasicPage title="Prompt Editor" description="Edit WeCom Leads LLM prompt templates and sales tag rules" sticky>
    <div class="space-y-4">
      <Card>
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>WeCom Leads Prompt Editor</CardTitle>
              <div class="mt-1 text-sm text-muted-foreground">
                Sales playbook content is included in rendered previews, but is not editable here.
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" :disabled="promptsQuery.isFetching.value" @click="promptsQuery.refetch()">
                <RefreshCw class="mr-2 size-4" :class="{ 'animate-spin': promptsQuery.isFetching.value }" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" :disabled="!promptsQuery.data.value" @click="resetFromServer">
                Reset
              </Button>
              <Button size="sm" :disabled="savePromptsMutation.isPending.value || !!tagRuleError" @click="savePrompts">
                <Save class="mr-2 size-4" />
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
        <Card>
          <CardContent class="pt-6">
            <Tabs default-value="prompts" class="w-full">
              <TabsList>
                <TabsTrigger value="prompts">
                  Prompts
                </TabsTrigger>
                <TabsTrigger value="rules">
                  Sales tag rules
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prompts" class="mt-4 space-y-4">
                <div class="space-y-2">
                  <div class="text-sm font-medium">
                    System prompt
                  </div>
                  <Textarea v-model="promptForm.system_prompt" class="min-h-[260px] font-mono text-xs" />
                </div>
                <div class="space-y-2">
                  <div class="text-sm font-medium">
                    User prompt template
                  </div>
                  <Textarea v-model="promptForm.user_prompt" class="min-h-[260px] font-mono text-xs" />
                </div>
              </TabsContent>

              <TabsContent value="rules" class="mt-4 space-y-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-sm font-medium">
                      Sales tag rules
                    </div>
                    <div class="text-xs text-muted-foreground">
                      These rows are loaded from and saved to public.wecom_sales_llm_tag_rules.
                    </div>
                  </div>
                  <Button variant="outline" size="sm" @click="addTagRule">
                    <Plus class="mr-2 size-4" />
                    Add rule
                  </Button>
                </div>

                <div v-if="promptForm.tag_rules.length === 0" class="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                  No tag rules found in database.
                </div>
                <div v-if="tagRuleError" class="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  {{ tagRuleError }}
                </div>

                <div v-if="promptForm.tag_rules.length > 0" class="space-y-3">
                  <div v-for="(rule, index) in promptForm.tag_rules" :key="`${rule.id}:${index}`" class="rounded-md border p-3">
                    <div class="grid gap-3 md:grid-cols-[88px_1fr_auto]">
                      <div class="space-y-1.5">
                        <div class="text-xs font-medium text-muted-foreground">
                          ID
                        </div>
                        <Input v-model.number="rule.id" type="number" min="1" class="h-9" />
                      </div>
                      <div class="space-y-1.5">
                        <div class="text-xs font-medium text-muted-foreground">
                          Tag name
                        </div>
                        <Input v-model="rule.tag_name" class="h-9" placeholder="Tag name" />
                      </div>
                      <div class="flex items-end">
                        <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive" @click="removeTagRule(index)">
                          <Trash2 class="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div class="mt-3 space-y-1.5">
                      <div class="text-xs font-medium text-muted-foreground">
                        Description
                      </div>
                      <Textarea v-model="rule.tag_desc" class="min-h-16 text-xs" />
                    </div>
                    <div class="mt-3 grid gap-3 md:grid-cols-2">
                      <div class="space-y-1.5">
                        <div class="text-xs font-medium text-muted-foreground">
                          Output schema when true
                        </div>
                        <Textarea v-model="rule.output_schema_true" class="min-h-24 font-mono text-xs" />
                      </div>
                      <div class="space-y-1.5">
                        <div class="text-xs font-medium text-muted-foreground">
                          Output schema when false
                        </div>
                        <Textarea v-model="rule.output_schema_false" class="min-h-24 font-mono text-xs" />
                      </div>
                    </div>
                    <div class="mt-3 space-y-1.5">
                      <div class="text-xs font-medium text-muted-foreground">
                        Output notes
                      </div>
                      <Textarea v-model="rule.output_notes" class="min-h-16 text-xs" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div class="space-y-4">
          <Card>
            <CardHeader class="pb-3">
              <CardTitle>Final Rendered Prompt Preview</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <div class="text-sm font-medium">
                  Preview transcript
                </div>
                <Textarea v-model="sampleTranscript" class="min-h-28 text-xs" />
              </div>
              <div class="space-y-2">
                <div class="text-sm font-medium">
                  System prompt
                </div>
                <pre class="max-h-[320px] overflow-auto rounded-md border bg-muted p-3 text-xs whitespace-pre-wrap">{{ renderedSystemPrompt || '-' }}</pre>
              </div>
              <div class="space-y-2">
                <div class="text-sm font-medium">
                  User prompt
                </div>
                <pre class="max-h-[420px] overflow-auto rounded-md border bg-muted p-3 text-xs whitespace-pre-wrap">{{ renderedUserPrompt || '-' }}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader class="pb-3">
              <CardTitle>Generated Tag Block</CardTitle>
            </CardHeader>
            <CardContent>
              <pre class="max-h-[320px] overflow-auto rounded-md border bg-muted p-3 text-xs whitespace-pre-wrap">{{ tagBlockPreview || '-' }}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </BasicPage>
</template>

<route lang="yml">
meta:
  auth: true
</route>
