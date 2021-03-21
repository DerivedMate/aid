import '@/styles/index.scss'

import React, { ReactElement, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import ErrorBoundary from '@/components/error-boundary'

import { IRoute } from './app.routes'

export interface IProps {
  routes?: (d: Dispatch) => IRoute[]
}

const DEFAULT_PROPS: IProps = {
  routes: () => []
}
export interface UserInfo {
  name: string
  lastname: string
  email: string
}
export interface IAppState {
  loggedIn: boolean
  userInfo?: UserInfo
}

export enum AppActionType {
  LogIn,
  LogOut
}
interface AppActionLogIn {
  type: AppActionType.LogIn
  userInfo: UserInfo
}
interface AppActionLogOut {
  type: AppActionType.LogOut
}
export type AppAction = AppActionLogIn | AppActionLogOut

export type Dispatch = (action: AppAction) => void

export const App = (props: IProps): ReactElement => {
  const { routes } = Object.assign(DEFAULT_PROPS, props)
  const [state, dispatch] = useReducer(
    (prev: IAppState, action: AppAction) => {
      switch (action.type) {
        case AppActionType.LogIn:
          return { ...prev, loggedIn: true, userInfo: action.userInfo }
        case AppActionType.LogOut:
          return { ...prev, loggedIn: false, userInfo: undefined }
        default:
          return prev
      }
    },
    { loggedIn: false, userInfo: undefined } as IAppState
  )

  return (
    <ErrorBoundary>
      <Helmet defaultTitle={process.env.APP_TITLE} titleTemplate={`%s | ${process.env.APP_TITLE}`}>
        <link rel='canonical' href={process.env.SERVER_BASE_URL} />
      </Helmet>
      <Router>
        <Switch>
          {routes(dispatch).map(({ component: Component, ...rest }) => (
            <Route
              exact={rest.exact || false}
              path={rest.path}
              key={`${rest.name}_${rest.path}`}
              render={routeProperties => <Component {...routeProperties} />}
            />
          ))}
          <Redirect to='/404' />
        </Switch>
      </Router>
    </ErrorBoundary>
  )
}
