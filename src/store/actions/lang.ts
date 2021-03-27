import { Lang, Locale } from '@/locale/model'

export enum LangActionType {
  ChangeLang = '@Action:Lang:ChangeLang'
}

export interface LangActionChangeLang {
  type: LangActionType.ChangeLang
  lang: Lang
}

export type LangAction = LangActionChangeLang

export interface LangState {
  lang: Lang
  dict: Locale
}

export const changeLang = (lang: Lang): LangAction => ({
  type: LangActionType.ChangeLang,
  lang
})
