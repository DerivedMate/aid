import getDict from '@/locale'
import englishDict from '@/locale/english.dict'
import { Lang } from '@/locale/model'
import { LangAction, LangActionType, LangState } from '../actions/lang'

const DEFAULT_LANG_STATE = {
  lang: Lang.English,
  dict: englishDict
}

const langReducer = (state: LangState = DEFAULT_LANG_STATE, action: LangAction): LangState => {
  switch (action.type) {
    case LangActionType.ChangeLang:
      return { ...state, lang: action.lang, dict: getDict(action.lang) }
    default:
      return state
  }
}

export default langReducer
