import React from 'react'
import { Home, NotFound, SignIn, SignUp } from '@/views'
import { Redirect, Switch } from 'react-router-dom'
import GuardedRoute from './components/guarded-route'
import About from './views/about'

interface IProps {
  auth: boolean
}

export const routes = ({ auth }: IProps): React.ReactElement => {
  console.log(auth)
  return (
    <>
      <Switch>
        <GuardedRoute auth={auth} exact path='/' key='home_/' component={Home} />
        <GuardedRoute auth={auth} path='/signin' key='signin_/signin' component={SignIn} />
        <GuardedRoute auth={auth} path='/signup' key='signup_/signup' component={SignUp} />
        <GuardedRoute auth={auth} guarded path='/about' key='about_/about' component={About} />
        <GuardedRoute auth={auth} path='/404' key='notFound_/404' component={NotFound} />
        <Redirect to='/404' />
      </Switch>
    </>
  )
}

export default routes
