import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import '@/assets/nprogress.css'

export function setupNProgress() {
  nprogress.configure({
    showSpinner: true,
    speed: 500,
    trickleSpeed: 200,
  })
}
