import type { IMessage } from '../types'

export const exampleTalks: IMessage[] = [
  {
    role: 'system',
    content: `Hello, I'm your smart assistant, how can I help you?`,
  },
  {
    role: 'user',
    content: 'Hi, who are you?',
  },
  {
    role: 'system',
    content: `I can answer your questions, provide information, and help you solve your problems. You can ask me anything and I'll do my best to answer it.`,
  },
]
