import '@/styles/index.scss'

import React, { ReactElement } from 'react'
import { History } from 'history'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import ErrorBoundary from '@/components/error-boundary'
import RoutesElem from './app.routes'
import configureStore from './store/configStore'
import Wrapper from './components/wrapper'

interface IProps {
  history: History
  store: ReturnType<typeof configureStore>
}

const App = ({ history, store }: IProps): ReactElement => {
  return (
    <ErrorBoundary>
      <Helmet defaultTitle={process.env.APP_TITLE} titleTemplate={`%s | ${process.env.APP_TITLE}`}>
        <link rel='canonical' href={process.env.SERVER_BASE_URL} />
      </Helmet>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Wrapper>
            <RoutesElem />
          </Wrapper>
        </ConnectedRouter>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
