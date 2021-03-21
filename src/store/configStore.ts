/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { createBrowserHistory } from 'history'
import { AnyAction, applyMiddleware, compose, createStore, Store } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer, { SubState } from './reducers'

export const history = createBrowserHistory()

export default function configureStore(preloadedState?: SubState): Store<SubState, AnyAction> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history)))
  )

  return store
}
