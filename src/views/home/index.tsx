import React from 'react'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router-dom'

import PwaReact from '@/images/pwa-react-uhd-trans.png'

import styles from './home.module.scss'

type TMatch = {
  path: string
}

const Home = ({ match }: RouteComponentProps<TMatch>): React.FunctionComponentElement<RouteComponentProps> => {
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
        <a href='./about' className={styles.testLink}>
          About
        </a>
      </div>
    </>
  )
}
export default Home
