import '@/styles/index.scss'

import React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import ErrorBoundary from '@/components/error-boundary'

import { IRoute } from './app.routes'

export interface IProps {
  routes?: IRoute[]
}

const DEFAULT_PROPS: IProps = {
  routes: []
}

export const App = (props: IProps) => {
  const { routes } = Object.assign(DEFAULT_PROPS, props)

  return (
    <ErrorBoundary>
      <Helmet defaultTitle={process.env.APP_TITLE} titleTemplate={`%s | ${process.env.APP_TITLE}`}>
        <link rel='canonical' href={process.env.SERVER_BASE_URL} />
      </Helmet>
      <Router>
        <Switch>
          {routes.map(({ component: Component, ...rest }) => (
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
