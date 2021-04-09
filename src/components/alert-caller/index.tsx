import React from 'react'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'

const showLocalNotification = (title: string, body: string): void => {
  const options = {
    body
  }

  navigator.serviceWorker
    .getRegistration()
    .then(r => r && r.showNotification(title, options))
    .catch(e => {
      console.error(e)
    })
}

const onPressReg = () => {
  window.Notification.requestPermission()
    .then(notPerm => {
      if (notPerm !== 'granted') {
        throw new Error('Permission not granted for Notification')
      }
    })
    .catch(console.error)
}

navigator.serviceWorker.addEventListener('message', msg => {
  console.dir(msg)
})

const onNotify = () => {
  navigator.serviceWorker.getRegistration().then(
    r =>
      r &&
      r.active.postMessage(
        JSON.stringify({
          type: 'LO_QUE_SEA',
          title: 'Message title',
          body: 'El cuerpo o lo que sea, no sé'
        })
      )
  )
}

const onPressTrigger = () => {
  showLocalNotification('This better fucking work', 'Coño, te mataré si no funciona esta wea... te lo juro')
}

const Eleme = () => {}
