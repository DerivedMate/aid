import { findRV, transposeDict } from '@/helpers/dicts'

export interface Locale {
  commonButtons: {
    learnMore: string
  }

  title: {
    home: string
    signIn: string
    signUp: string
    supervised: string
    account: string
    medications: string
    location: string
    health: string
  }

  home: {
    toAbout: {
      title: string
      subtitle: string
      body: string
    }
  }

  dashboard: {
    toSupervised: {
      title: string
      body: string
      button: string
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

  supervised: {
    list: {
      pageTitle: string
      item: {
        healthDetail: string
        location: string
        medications: string
      }
    }

    add: {
      title: string
      body: string
      fieldLabel: string
      button: string
      success: string
    }

    delete: {
      body: (n: string) => string
    }
  }

  medicine: {
    common: {
      topBar: {
        title: string
      }
      tabs: {
        all: string
        taken: string
        left: string
        ariaLabel: string
      }
      button: {
        take: string
        edit: string
        delete: string
        cancel: string
        confirm: string
        save: string
        add: string
      }
      take: {
        title: string
        body: (name: string) => string
      }
      datePicker: {
        label: string
      }
      alter: {
        empty: string
        error: (m: string) => string
        authError: (m: string) => string
      }
      loading: {
        loadingMedicine: string
        authorizing: string
      }
    }

    all: {
      edit: {
        title: string
        body: string
        name: string
        unit: string
        amount: string
      }
      delete: {
        title: string
        body: (name: string) => string
      }
      add: {
        title: string
        body: string
      }
    }
    taken: {
      delete: {
        title: string
        body: (name: string) => string
      }
    }
  }

  account: {
    logout: string
  }

  alert: {
    title: string
    body: (n: string, t: string) => string
    bodyNoDate: (n: string) => string
    trigger: string
    ignore: string
    respond: string
  }

  info: {
    name: string
    bloodType: string
    hcNumber: string
    lastname: string
    info: string
    additional: string
    key: string
    value: string
    add: string
    details: string
    save: string
    edit: string
  }

  call: {
    retry: string
    calling: string
    inCall: string
    call: string
  }

  location: {
    stageButton: {
      fetchingWard: string
      fetchingRoute: string
      retryFetching: string
      acceptReq: string
      reCalcRoute: string
      calcRoute: string
      cancelRoute: string
    }
    map: {
      dist: string
      duration: string
      yourPosition: string
    }
    error: {
      routeFetching: string
    }
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
