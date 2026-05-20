export interface WeComCustomer {
  external_userid: string
  name?: string | null
  type?: number | null
  avatar?: string | null
  gender?: number | null
  position?: string | null
  corp_name?: string | null
  corp_full_name?: string | null
  created_at?: string | null
  updated_at?: string | null
  follower_count: number
  owner_userids: string[]
  owner_summary: string
  tag_summary: string[]
  latest_follow_updated_at?: string | null
}

export interface WeComCustomerListResponse {
  items: WeComCustomer[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface WeComCustomerAnalyticsRow {
  userid: string
  added_date: string
  new_customer_count: number
  cumulative_customer_count: number
}

export interface WeComCustomerAnalyticsResponse {
  items: WeComCustomerAnalyticsRow[]
}

export interface WeComCustomerAnalyticsParams {
  userid?: string
  added_date?: string
}

export interface WeComCustomerListParams {
  page?: number
  page_size?: number
  search?: string
  owner_userid?: string
  corp_name?: string
  gender?: number
  type?: number
  tag?: string
  follow_created_from?: string
  follow_created_to?: string
  updated_from?: string
  updated_to?: string
}

export interface WeComFollowRelation {
  external_userid: string
  userid: string
  remark?: string | null
  description?: string | null
  createtime?: number | null
  add_way?: number | null
  add_way_description?: string | null
  oper_userid?: string | null
  state?: string | null
  remark_corp_name?: string | null
  remark_mobiles?: unknown
  tags?: unknown
  created_at?: string | null
  updated_at?: string | null
}

export interface WeComCustomerDetail extends Omit<WeComCustomer, 'follower_count' | 'owner_userids' | 'owner_summary' | 'tag_summary' | 'latest_follow_updated_at'> {
  follow_relations: WeComFollowRelation[]
}

export type WeComChatThreadType = 'private' | 'group'

export interface WeComChatThread {
  thread_id: string
  thread_type: WeComChatThreadType
  title: string
  participant_summary: string
  message_count: number
  latest_msgtime?: number | null
  latest_msgtype?: string | null
  latest_preview: string
  staff_userid?: string | null
  external_userid?: string | null
  external_name?: string | null
  roomid?: string | null
  group_name?: string | null
  owner?: string | null
  member_count?: number | null
}

export interface WeComChatThreadListParams {
  page?: number
  page_size?: number
  thread_name?: string
  staff_userid?: string
  last_message_from?: string
  last_message_to?: string
}

export interface WeComChatThreadListResponse {
  items: WeComChatThread[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface WeComChatMedia {
  sdkfileid?: string | null
  oss_key?: string | null
  url?: string | null
  expires_at?: string | null
  byte_size?: number | null
  filename?: string | null
  fileext?: string | null
  width?: number | null
  height?: number | null
}

export interface WeComChatLink {
  title?: string | null
  description?: string | null
  url?: string | null
  image_url?: string | null
}

export interface WeComChatMessage {
  msgid: string
  seq?: number | null
  action?: string | null
  from_userid: string
  tolist: string[]
  roomid?: string | null
  msgtime?: number | null
  msgtype?: string | null
  content_text: string
  payload?: unknown
  raw_json: unknown
  sender_display_name: string
  direction: 'inbound' | 'outbound'
  media?: WeComChatMedia | null
  link?: WeComChatLink | null
}

export interface WeComChatMessageListResponse {
  thread: WeComChatThread
  items: WeComChatMessage[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface WeComChatMessageListParams {
  page?: number
  page_size?: number
}

export interface WeComLead {
  thread_type: WeComChatThreadType
  thread_id: string
  contact_name: string
  external_userid?: string | null
  salesperson_userids: string[]
  date_added?: string | null
  chat_type_label: string
  apollo_message_count: number
  customer_reply_count: number
  last_messaged?: string | null
  status: string
  prompt_id?: string | null
  tag_values?: Record<string, unknown> | null
  playbook_alignment?: unknown
  playbook_alignment_summary: string
  objections_raised?: unknown
  objections_summary: string
  violations?: unknown
  violations_summary: string
  quality_score?: number | null
  error_message?: string | null
  analyzed_at?: string | null
  tag_updated_at?: string | null
  conversation_path: string
}

export interface WeComLeadListParams {
  page?: number
  page_size?: number
  search?: string
  chat_type?: string
  salesperson?: string
  status?: string
  last_message_from?: string
  last_message_to?: string
  min_quality_score?: number
  max_quality_score?: number
  sort_by?: 'score' | 'apollo_messages' | 'replies' | 'last_messaged'
  sort_dir?: 'asc' | 'desc'
}

export interface WeComLeadListResponse {
  items: WeComLead[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface WeComLeadPromptRule {
  id: number
  tag_name: string
  tag_desc: string
  output_schema_true: string
  output_schema_false: string
  output_notes: string
}

export interface WeComLeadPromptConfig {
  id: string
  system_prompt: string
  user_prompt: string
  playbook_text: string
  tag_rules: WeComLeadPromptRule[]
  tag_block: string
  created_at?: string | null
  updated_at?: string | null
}

export interface WeComLeadPromptUpdate {
  system_prompt: string
  user_prompt: string
  playbook_text: string
  tag_rules: WeComLeadPromptRule[]
}

export interface WeComLeadJobRun {
  id: string
  trigger_type: string
  status: string
  started_at: string
  finished_at?: string | null
  total_count: number
  success_count: number
  failed_count: number
  skipped_count: number
  error_message?: string | null
}

export interface WeComLeadLatestJobResponse {
  latest_run?: WeComLeadJobRun | null
  manual_allowed: boolean
  cooldown_until?: string | null
}

export interface WeComLeadTaggingTarget {
  thread_type: WeComChatThreadType
  thread_id: string
}

export interface WeComLeadTriggerRequest {
  selected_leads?: WeComLeadTaggingTarget[]
}

export interface WeComLeadTriggerResponse {
  accepted: boolean
  invocation_id?: string | null
  cooldown_until?: string | null
  message: string
}
