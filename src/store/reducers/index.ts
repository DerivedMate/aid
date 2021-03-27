import { AnyAction, combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { RouterState, connectRouter } from 'connected-react-router'
import userReducer from './user'
import { User as UserState } from '../actions/user'
import { LangState } from '../actions/lang'
import langReducer from './lang'

const rootReducer = (history: History): Reducer<SubState, AnyAction> =>
  combineReducers({
    user: userReducer,
    lang: langReducer,
    router: connectRouter(history)
  })

export interface SubState {
  user: UserState
  lang: LangState
}

export interface State extends SubState {
  router: RouterState
}

export default rootReducer
