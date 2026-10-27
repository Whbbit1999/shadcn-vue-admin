import type { Component } from 'vue'

export interface IApp {
  name: string
  logo: Component
  descKey: string
  connected: boolean
}
