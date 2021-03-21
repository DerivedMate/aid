import { LoadableComponent } from '@loadable/component'

import { About, Home, NotFound, SignIn, SignUp } from '@/views'
import { Dispatch } from './app'
import { RouteComponentProps } from 'react-router'

export interface IRoute {
  name: string
  exact?: boolean
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LoadableComponent<any>
  dispatch: Dispatch
}

export interface DynamicRouteProps<T> extends RouteComponentProps<T> {
  dispatch: Dispatch
}

const routes = (d: Dispatch): IRoute[] => [
  {
    name: 'home',
    exact: true,
    path: '/',
    component: Home,
    dispatch: d
  },
  {
    name: 'notFound',
    path: '/404',
    component: NotFound,
    dispatch: d
  },
  {
    name: 'about',
    path: '/about',
    component: About,
    dispatch: d
  },
  {
    name: 'signin',
    path: '/signin',
    component: SignIn,
    dispatch: d
  },
  {
    name: 'signup',
    path: '/signup',
    component: SignUp,
    dispatch: d
  }
]

export default routes
