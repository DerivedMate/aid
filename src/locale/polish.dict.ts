import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Dowiedz się więcej'
  },

  title: {
    home: 'Strona G.',
    signIn: 'Logowanie',
    signUp: 'Rejestracja',
    supervised: 'Podopieczni',
    account: 'Konto',
    medications: 'Leki',
    location: 'Lokalizacja',
    health: 'Zdrowie'
  },

  home: {
    toAbout: {
      title: 'Aid',
      subtitle: 'Bezpieczeństwo zawsze przy tobie.',
      body:
        'Aid Mate to rewolocyjne rozwiązanie w zakresie monitorowania bezpieczeństwa i nadawania samodzielności osobom z niepełnosprawnościami, seniorom i innym grupom potrzebującym codziennego wsparcia.'
    }
  },

  dashboard: {
    toSupervised: {
      title: 'Podopieczni',
      body: 'Tu znajdziesz informację dotyczące lokalizacji, danych medycznych i leków Twoich podopiecznych.',
      button: 'Przejdź do podopiecznych'
    }
  },

  menu: {
    home: 'Strona G.',
    about: 'O Aplik.',
    signIn: 'Zaloguj się',
    supervised: 'Podopieczni',
    account: 'Konto'
  },

  signIn: {
    email: 'E-mail',
    password: 'Hasło',
    remember: 'Zapamiętaj mnie',
    signIn: 'Zaloguj się',
    forgotPassword: 'Zapomniałeś/aś hasła?',
    noAccount: 'Nie masz jeszcze konta?'
  },

  signUp: {
    firstName: 'Imię/Imiona',
    lastName: 'Nazwisko',
    email: 'E-mail',
    password: 'Hasło',
    signUp: 'Zarejestruj się',
    forgotPassword: 'Zapomniałeś/aś hasła?',
    alreadyAccount: 'Masz już konto?'
  },

  supervised: {
    list: {
      pageTitle: 'Lista podopiecznych',
      item: {
        healthDetail: 'Info. Zdrowotne',
        location: 'Położenie',
        medications: 'Leki'
      }
    },

    add: {
      title: 'Dodaj podopiecznego/ną',
      body: 'Wprowadź id urządzenia, które znajduje się z tyłu urządzenia / na karcie gwarancyjnej.',
      fieldLabel: 'Id urządzenia',
      button: 'Dodaj',
      success: 'Pomyślnie dodano podopiecznego/ną'
    },

    delete: {
      body: (n: string): string => `Jesteś pewien/na, że chcesz usunąć ${n} z podopiecznych?`
    }
  },

  medicine: {
    common: {
      topBar: {
        title: 'Leki'
      },
      tabs: {
        all: 'Wszystkie',
        taken: 'Wzięte',
        left: 'Niewzięte',
        ariaLabel: 'Zakładki Leków'
      },
      button: {
        take: 'Weź',
        edit: 'Edytuj',
        delete: 'Usuń',
        cancel: 'Cofnij',
        confirm: 'Potwierdź',
        save: 'Zapisz',
        add: 'Dodaj'
      },
      take: {
        title: 'Weź lek',
        body: (n: string): string => `Czy jesteś pewien/na, że chcesz wziąć lek: ${n}?`
      },
      datePicker: {
        label: 'Wybierz datę'
      },
      alter: {
        empty: 'Niczego nie znaleziono',
        error: (m: string): string => `Napotkano na błąd:\n${m}`,
        authError: (m: string): string => `Odmowa dostępu:\n${m}`
      },
      loading: {
        loadingMedicine: 'Ładowanie Leków',
        authorizing: 'Autoryzacja'
      }
    },

    all: {
      edit: {
        title: 'Edytuj Lek',
        body: 'Tu możesz edytować informacje na temat danego leku.',
        name: 'Nazwa',
        unit: 'Jednostka',
        amount: 'Ilość Jednostek'
      },
      delete: {
        title: 'Usuń Lek',
        body: (n: string): string => `Czy jesteś pewien/na, że chcesz usunąć lek: ${n}?`
      },
      add: {
        title: 'Dodaj Lek',
        body: 'Wprowadź informacje o nowym leku.'
      }
    },
    taken: {
      delete: {
        title: 'Usuń wzięcie',
        body: (n: string): string => `Czy jesteś pewien/na, że chcesz usunąć wzięcie leku: ${n}`
      }
    }
  },
  account: {
    logout: 'Wyloguj się'
  },

  alert: {
    title: 'Alert!',
    body: (n: string, t: string): string =>
      `${n} napotkał(a) na pewne trudności w okolicach ${t}. Przydałaby mu/jej się Twoja pomoc.`,
    bodyNoDate: (n: string): string => `${n} napotkał(a) na pewne trudności. Przydałaby mu/jej się Twoja pomoc.`,
    trigger: 'Zasymuluj Alert',
    ignore: 'Ignoruj',
    respond: 'Odpowiedz'
  },

  info: {
    name: 'Imię',
    bloodType: 'Grupa Krwi',
    hcNumber: 'Nr. Karty Zdrowia',
    lastname: 'Nazwisko',
    info: 'Informacje Główne',
    additional: 'Informacje dodatkowe',
    key: 'Klucz',
    value: 'Wartość',
    add: 'Dodaj',
    details: 'Info. Zdrowotne',
    save: 'Zapisz',
    edit: 'Edytuj'
  },

  call: {
    retry: 'Spróbuj Ponownie',
    calling: 'Łączę się',
    inCall: 'Rozmowa Trwa',
    call: 'Połącz się'
  },

  location: {
    stageButton: {
      fetchingWard: 'Pobieranie Pozycji Podopiecznego/nej',
      fetchingRoute: 'Pobieranie Drogi',
      retryFetching: 'Spróbuj Pobrać Ponownie',
      acceptReq: 'Zaakceptuj Prośbę o Lokalizację',
      reCalcRoute: 'Ponownie oblicz drogę',
      calcRoute: 'Oblicz Drogę',
      cancelRoute: 'Anuluj Drogę'
    },

    map: {
      dist: 'Dystans',
      duration: 'Czas trwania',
      yourPosition: 'Twoja Pozycja'
    },

    error: {
      routeFetching: 'Błąd Pobierania Drogi'
    }
  }
}

export default dict
