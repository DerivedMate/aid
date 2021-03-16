import React from 'react'
import { render } from 'react-dom'

import { App } from '@/app'

import routes from './app.routes'

const DOM_NODE: HTMLElement = document.querySelector('.appWrapper')

render(<App routes={routes} />, DOM_NODE)

/**
 * Service worker register and event listeners
 */
const registerSw = async (): Promise<ServiceWorkerRegistration> => {
  const { Workbox } = await import(/* webpackChunkName: 'workbox-window' */ 'workbox-window')

  const wb = new Workbox('/service-worker.js')

  return wb.register()
}

const initServices = async () => {
  if (process.env.NODE_ENV === 'production') {
    if ('serviceWorker' in navigator) {
      await registerSw()
    }
  }
}

initServices()
