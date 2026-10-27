import type { TalkRole } from '../types'

export interface IExampleTalk {
  role: TalkRole
  contentKey: string
}

export const exampleTalks: IExampleTalk[] = [
  {
    role: 'system',
    contentKey: 'aiTalk.demo.greeting',
  },
  {
    role: 'user',
    contentKey: 'aiTalk.demo.user',
  },
  {
    role: 'system',
    contentKey: 'aiTalk.demo.reply',
  },
]
