export type TalkRole = 'user' | 'system'

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
