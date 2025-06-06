import { DiscordIcon, DockerIcon, FigmaIcon, GitHubIcon, GitLabIcon, GmailIcon, MediumIcon, NotionIcon, SlackIcon, StripeIcon, TelegramIcon, TrelloIcon, WhatsAppIcon, ZoomIcon } from 'vue3-simple-icons'

import type { IApp } from '../type'

const apps: IApp[] = [
  {
    name: 'Telegram',
    logo: h(TelegramIcon),
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    logo: h(NotionIcon),
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: h(FigmaIcon),
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    logo: h(TrelloIcon),
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: h(SlackIcon),
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    logo: h(ZoomIcon),
    connected: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    logo: h(StripeIcon),
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: h(GmailIcon),
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    logo: h(MediumIcon),
    connected: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    logo: h(StripeIcon),
    connected: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  {
    name: 'Docker',
    logo: h(DockerIcon),
    connected: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    logo: h(GitHubIcon),
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: h(GitLabIcon),
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  {
    name: 'Discord',
    logo: h(DiscordIcon),
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    logo: h(WhatsAppIcon),
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]

export default apps
