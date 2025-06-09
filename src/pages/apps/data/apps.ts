import { Icon } from '@iconify/vue'

import type { IApp } from '../type'

const apps: IApp[] = [
  {
    name: 'Telegram',
    logo: h(Icon, { icon: 'simple-icons:telegram' }),
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    logo: h(Icon, { icon: 'simple-icons:notion' }),
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: h(Icon, { icon: 'simple-icons:figma' }),
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    logo: h(Icon, { icon: 'simple-icons:trello' }),
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: h(Icon, { icon: 'simple-icons:slack' }),
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    logo: h(Icon, { icon: 'simple-icons:zoom' }),
    connected: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    logo: h(Icon, { icon: 'simple-icons:stripe' }),
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: h(Icon, { icon: 'simple-icons:gmail' }),
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    logo: h(Icon, { icon: 'simple-icons:medium' }),
    connected: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    logo: h(Icon, { icon: 'simple-icons:skype' }),
    connected: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  {
    name: 'Docker',
    logo: h(Icon, { icon: 'simple-icons:docker' }),
    connected: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    logo: h(Icon, { icon: 'simple-icons:github' }),
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: h(Icon, { icon: 'simple-icons:gitlab' }),
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  {
    name: 'Discord',
    logo: h(Icon, { icon: 'simple-icons:discord' }),
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    logo: h(Icon, { icon: 'simple-icons:whatsapp' }),
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]

export default apps
