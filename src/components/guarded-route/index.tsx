import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface IProps extends RouteProps {
  guarded?: boolean
  auth: boolean
  redirectTo?: string
}

interface IDeProps extends RouteProps {
  deGuarded?: boolean
  auth: boolean
  redirectTo?: string
}

const DEFAULT_PROPS: IProps = {
  guarded: false,
  auth: false,
  redirectTo: '/signin'
}

const DEFAULT_DE_PROPS: IDeProps = {
  deGuarded: false,
  auth: false,
  redirectTo: '/'
}

/**
 * @description {Accessible only after authorization}
 */
export const GuardedRoute = (props_?: IProps): React.ReactElement => {
  const { auth, guarded, redirectTo, ...props } = { ...DEFAULT_PROPS, ...props_ }

  if ((guarded && auth) || !guarded) return <Route {...props} />
  return <Redirect to={redirectTo} />
}

/**
 * @description Inaccessible while being authorized
 */
export const DeGuardedRoute = (props_?: IDeProps): React.ReactElement => {
  const { auth, deGuarded, redirectTo, ...props } = { ...DEFAULT_DE_PROPS, ...props_ }

  if ((deGuarded && !auth) || !deGuarded) return <Route {...props} />
  return <Redirect to={redirectTo} />
}
