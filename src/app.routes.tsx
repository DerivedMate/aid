import React from 'react'

import { Home, NotFound, SignIn, SignUp } from '@/views'
import { Redirect, Route, Switch } from 'react-router-dom'

export const routes = (): React.ReactElement => {
  return (
    <>
      <Switch>
        <Route exact path='/' key='home_/' component={Home} />
        <Route path='/signin' key='signin_/signin' component={SignIn} />
        <Route path='/signup' key='signup_/signup' component={SignUp} />
        <Route path='/404' key='notFound_/404' component={NotFound} />
        <Redirect to='/404' />
      </Switch>
    </>
  )
}

export default routes
