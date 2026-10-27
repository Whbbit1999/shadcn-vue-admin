import { Icon } from '@iconify/vue'

import type { IApp } from '../type'

const apps: IApp[] = [
  {
    name: 'Telegram',
    logo: h(Icon, { icon: 'simple-icons:telegram' }),
    connected: false,
    descKey: 'apps.list.telegram',
  },
  {
    name: 'Notion',
    logo: h(Icon, { icon: 'simple-icons:notion' }),
    connected: true,
    descKey: 'apps.list.notion',
  },
  {
    name: 'Figma',
    logo: h(Icon, { icon: 'simple-icons:figma' }),
    connected: true,
    descKey: 'apps.list.figma',
  },
  {
    name: 'Trello',
    logo: h(Icon, { icon: 'simple-icons:trello' }),
    connected: false,
    descKey: 'apps.list.trello',
  },
  {
    name: 'Slack',
    logo: h(Icon, { icon: 'simple-icons:slack' }),
    connected: false,
    descKey: 'apps.list.slack',
  },
  {
    name: 'Zoom',
    logo: h(Icon, { icon: 'simple-icons:zoom' }),
    connected: true,
    descKey: 'apps.list.zoom',
  },
  {
    name: 'Stripe',
    logo: h(Icon, { icon: 'simple-icons:stripe' }),
    connected: false,
    descKey: 'apps.list.stripe',
  },
  {
    name: 'Gmail',
    logo: h(Icon, { icon: 'simple-icons:gmail' }),
    connected: true,
    descKey: 'apps.list.gmail',
  },
  {
    name: 'Medium',
    logo: h(Icon, { icon: 'simple-icons:medium' }),
    connected: false,
    descKey: 'apps.list.medium',
  },
  {
    name: 'Skype',
    logo: h(Icon, { icon: 'simple-icons:skype' }),
    connected: false,
    descKey: 'apps.list.skype',
  },
  {
    name: 'Docker',
    logo: h(Icon, { icon: 'simple-icons:docker' }),
    connected: false,
    descKey: 'apps.list.docker',
  },
  {
    name: 'GitHub',
    logo: h(Icon, { icon: 'simple-icons:github' }),
    connected: false,
    descKey: 'apps.list.github',
  },
  {
    name: 'GitLab',
    logo: h(Icon, { icon: 'simple-icons:gitlab' }),
    connected: false,
    descKey: 'apps.list.gitlab',
  },
  {
    name: 'Discord',
    logo: h(Icon, { icon: 'simple-icons:discord' }),
    connected: false,
    descKey: 'apps.list.discord',
  },
  {
    name: 'WhatsApp',
    logo: h(Icon, { icon: 'simple-icons:whatsapp' }),
    connected: false,
    descKey: 'apps.list.whatsapp',
  },
]

export default apps
