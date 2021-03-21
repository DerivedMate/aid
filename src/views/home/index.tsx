import React from 'react'
import PwaReact from '@/images/pwa-react-uhd-trans.png'
import { Helmet } from 'react-helmet'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button } from '@material-ui/core'

import styles from './home.module.scss'

type TMatch = {
  path: string
}

const showLocalNotification = (title: string, body: string): void => {
  const options = {
    body
  }

  navigator.serviceWorker
    .getRegistration()
    .then(r => r.showNotification(title, options))
    .catch(e => {
      console.error(e)
    })
}

const Home = ({ match }: RouteComponentProps<TMatch>): React.FunctionComponentElement<RouteComponentProps> => {
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

  const { path } = match
  const canonicalUrl = `${process.env.SERVER_BASE_URL}${path}`
  const appTitle = 'ReactJS Progressive Web App'
  const description =
    'A fast and full TypeScript PWA built with React with every best practices for SEO and web performances'

  return (
    <>
      <Helmet>
        <title>Home</title>
        <link rel='canonical' href={canonicalUrl} />
        <meta name='description' content={description} />
      </Helmet>
      <div className={styles.container}>
        <h1 className={styles.title}>{appTitle}</h1>
        <img
          className={styles.image}
          src={PwaReact.src}
          srcSet={PwaReact.srcSet}
          sizes='(max-width: 440px) 220px,
            (max-width: 640px) 320px,
            (max-width: 1280px) 450px'
          width={PwaReact.width}
          height={PwaReact.height}
          loading='lazy'
          alt='Pwa React'
        />
        <Link to='/about' className={styles.testLink}>
          About
        </Link>
        <Link to='/signin' className={styles.testLink}>
          Sign In
        </Link>
        <Link to='/signup' className={styles.testLink}>
          Sign Up
        </Link>
        <Button color='primary' onClick={onPressReg}>
          Ask me
        </Button>
        <Button color='primary' onClick={onPressTrigger}>
          Trigger me
        </Button>
        <Button color='primary' onClick={onNotify}>
          Send a message
        </Button>
      </div>
    </>
  )
}

export default Home
