type Translate = (key: string) => string

const greetingKeywords = ['你好', 'hello', 'hi']
const capabilitiesKeywords = ['功能', '能力', 'what can you do']
const strengthsKeywords = ['优点', '优势', 'strengths', 'advantages']
const weaknessesKeywords = ['缺点', '不足', '劣势', 'weaknesses', 'limitations', 'disadvantages']
const weatherKeywords = ['weather', '天气']

const defaultReplyKeys = [
  'aiTalk.answer.defaults.default1',
  'aiTalk.answer.defaults.default2',
  'aiTalk.answer.defaults.default3',
  'aiTalk.answer.defaults.default4',
]

function containsKeyword(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword))
}

export function pickReply(userContent: string, t: Translate): string {
  const lower = userContent.toLowerCase()

  if (containsKeyword(lower, greetingKeywords))
    return t('aiTalk.answer.greeting')

  if (containsKeyword(lower, capabilitiesKeywords))
    return t('aiTalk.answer.capabilities')

  if (containsKeyword(lower, strengthsKeywords))
    return t('aiTalk.answer.strengths')

  if (containsKeyword(lower, weaknessesKeywords))
    return t('aiTalk.answer.weaknesses')

  if (containsKeyword(lower, weatherKeywords))
    return t('aiTalk.answer.weather')

  return t(defaultReplyKeys[Math.floor(Math.random() * defaultReplyKeys.length)])
}
