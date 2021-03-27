import polish from './polish.dict'
import english from './english.dict'
import spanish from './spanish.dict'
import { Lang, Locale } from './model'

export const getDict = (ln: Lang): Locale => {
  switch (ln) {
    case Lang.Polish:
      return polish
    case Lang.English:
      return english
    case Lang.Spanish:
      return spanish
    default:
      return polish
  }
}
