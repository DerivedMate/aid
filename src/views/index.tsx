import loadable from '@loadable/component'
import React from 'react'

import Loader from '@/components/loader'

const loadableOptions = {
  fallback: <Loader />
}

export const Home = loadable(() => import(/* webpackChunkName: 'home' */ './home'), loadableOptions)

export const NotFound = loadable(() => import(/* webpackChunkName: 'notFound' */ './not-found'), loadableOptions)

export const About = loadable(() => import(/* webpackChunkName: 'about' */ './about'), loadableOptions)

export const SignIn = loadable(() => import(/* webpackChunkName: 'signin' */ './signin'), loadableOptions)

export const SignUp = loadable(() => import(/* webpackChunkName: 'signin' */ './signup'), loadableOptions)

export const Dashboard = loadable(() => import(/* webpackChunkName: 'dashboard' */ './dashboard'), loadableOptions)

export const Supervised = loadable(() => import(/* webpackChunkName: 'supervised' */ './supervised'), loadableOptions)

export const Medicine = loadable(() => import(/* webpackChunkName: 'medicine' */ './medicine'), loadableOptions)

export const Account = loadable(() => import(/* webpackChunkName: 'account' */ './account'), loadableOptions)

export const Location = loadable(() => import(/* webpackChunkName: 'location' */ './location'), loadableOptions)
