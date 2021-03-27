import React from 'react'
import {
  Home as HomeRoute,
  NotFound as NotFoundRoute,
  SignIn as SignInRoute,
  SignUp as SignUpRoute,
  About as AboutRoute
} from '@/views'
import { Redirect, Switch } from 'react-router-dom'
import { DeGuardedRoute, GuardedRoute } from './components/guarded-route'

export enum Routes {
  // General
  Home = '/',
  Null = '',
  // Not logged in
  SignIn = '/signin',
  SignUp = '/signup',
  About = '/about',
  // Logged in
  Supervised = '/supervised',
  Account = '/account'
}

interface IProps {
  auth: boolean
}

export const routes = ({ auth }: IProps): React.ReactElement => {
  console.log(auth)
  return (
    <>
      <Switch>
        <GuardedRoute auth={auth} exact path={Routes.Home} key='home_/' component={HomeRoute} />
        <DeGuardedRoute auth={auth} deGuarded path={Routes.SignIn} key='signin_/signin' component={SignInRoute} />
        <DeGuardedRoute auth={auth} deGuarded path={Routes.SignUp} key='signup_/signup' component={SignUpRoute} />
        <GuardedRoute auth={auth} guarded path={Routes.About} key='about_/about' component={AboutRoute} />
        <GuardedRoute auth={auth} path='/404' key='notFound_/404' component={NotFoundRoute} />
        <Redirect to='/404' />
      </Switch>
    </>
  )
}

export default routes
