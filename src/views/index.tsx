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
