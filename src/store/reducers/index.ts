import { AnyAction, combineReducers, Reducer, Store } from 'redux'
import { History } from 'history'
import { RouterState, connectRouter } from 'connected-react-router'
import { Lang, langOfString } from '@/locale/model'
import userReducer from './user'
import { User as UserState } from '../actions/user'
import { changeLang, LangState } from '../actions/lang'
import langReducer from './lang'
import { Action } from '../actions'

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

export const initLangState: (store: Store<SubState, Action>) => void = store => {
  const langs = window.navigator.languages.filter(l => !/-/.test(l))
  const avLangs = [Lang.Polish, Lang.Spanish, Lang.English].map(String)
  const lang = langOfString(langs.find(l => avLangs.includes(l)) || 'pl')

  store.dispatch(changeLang(lang))
}

export default rootReducer
