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
}
