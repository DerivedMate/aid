import { LoadableComponent } from '@loadable/component'

import { About, Home, NotFound, SignIn } from '@/views'

export interface IRoute {
  name: string
  exact?: boolean
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: LoadableComponent<any>
}

const routes: IRoute[] = [
  {
    name: 'home',
    exact: true,
    path: '/',
    component: Home
  },
  {
    name: 'notFound',
    path: '/404',
    component: NotFound
  },
  {
    name: 'about',
    path: '/about',
    component: About
  },
  {
    name: 'signin',
    path: '/signin',
    component: SignIn
  }
]

export default routes
