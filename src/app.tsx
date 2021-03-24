import '@/styles/index.scss'

import React, { ReactElement } from 'react'
import { History } from 'history'
import { Helmet } from 'react-helmet'
import ErrorBoundary from '@/components/error-boundary'
import { ConnectedRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import Routes from './app.routes'
import configureStore from './store/configStore'

interface IProps {
  history: History
  store: ReturnType<typeof configureStore>
}

const App = ({ history, store }: IProps): ReactElement => {
  const auth = store.getState().user.loggedIn

  return (
    <ErrorBoundary>
      <Helmet defaultTitle={process.env.APP_TITLE} titleTemplate={`%s | ${process.env.APP_TITLE}`}>
        <link rel='canonical' href={process.env.SERVER_BASE_URL} />
      </Helmet>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routes auth={auth} />
        </ConnectedRouter>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
