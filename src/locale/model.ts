import { findRV, transposeDict } from '@/helpers/dicts'

export interface Locale {
  commonButtons: {
    learnMore: string
  }

  home: {
    toAbout: {
      title: string
      subtitle: string
      body: string
    }
  }

  menu: {
    home: string
    about: string
    signIn: string
    supervised: string
    account: string
  }

  signIn: {
    email: string
    password: string
    remember: string
    signIn: string
    forgotPassword: string
    noAccount: string
  }

  signUp: {
    firstName: string
    lastName: string
    email: string
    password: string
    signUp: string
    forgotPassword: string
    alreadyAccount: string
  }
}

export enum Lang {
  Polish = 'pl',
  English = 'en',
  Spanish = 'es'
}

const langStrMap = {
  [Lang.Polish]: 'pl',
  [Lang.English]: 'en',
  [Lang.Spanish]: 'es'
}

const strLangMap = transposeDict(langStrMap)

export const langOfString = (str: string): Lang => findRV(strLangMap, Lang.Polish, str)

export const stringOfLang = (ln: Lang): string => findRV(langStrMap, 'pl', ln)