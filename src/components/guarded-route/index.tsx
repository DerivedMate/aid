import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface IProps extends RouteProps {
  guarded?: boolean
  auth: boolean
}

const DEFAULT_PROPS = {
  guard: false
}

const GuardedRoute = (props_?: IProps): React.ReactElement => {
  const { auth, guarded, ...props } = { ...DEFAULT_PROPS, ...props_ }

  if ((guarded && auth) || !guarded) return <Route {...props} />
  return <Redirect to='/signin' />
}

export default GuardedRoute
