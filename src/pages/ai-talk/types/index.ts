export type TalkRole = 'user' | 'system'
export type TalkMode = 'deep-think' | 'online'

export interface IMessage {
  role: TalkRole
  content: string
}

type TAIModel = 'deepseek-chat'

export interface IChatReq {
  model: TAIModel
  stream: boolean
  messages: IMessage[]
}
