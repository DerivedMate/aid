/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore, Store } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer, { SubState } from './reducers'
import { Action } from './actions'

export const history = createBrowserHistory()

export default function configureStore(preloadedState?: SubState): Store<SubState, Action> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const composeEnhancer: typeof compose =
    ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })) ||
    compose
  // : typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history)))
  )

  return store
}
