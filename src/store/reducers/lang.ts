import getDict from '@/locale'
import { Lang, langOfString } from '@/locale/model'
import { LangAction, LangActionType, LangState } from '../actions/lang'

export const DEFAULT_STATE: LangState = (() => {
  const langs = window.navigator.languages.filter(l => !/-/.test(l))
  const avLangs = [Lang.Polish, Lang.Spanish, Lang.English].map(String)
  const lang = langOfString(langs.find(l => avLangs.includes(l)) || 'pl')

  return {
    lang,
    dict: getDict(lang)
  }
})()

const langReducer = (state: LangState = DEFAULT_STATE, action: LangAction): LangState => {
  switch (action.type) {
    case LangActionType.ChangeLang:
      return { ...state, lang: action.lang, dict: getDict(action.lang) }
    default:
      return state
  }
}

export default langReducer
