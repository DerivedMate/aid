import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Dowiedz się więcej'
  },

  home: {
    toAbout: {
      title: 'Aid',
      subtitle: 'Lepiej. Szybciej. Bezpieczniej.',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, soluta.'
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
      button: 'Dodaj'
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
        left: 'Niewzięte'
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
        body: n => `Czy jesteś pewien/na, że chcesz wziąć lek: ${n}?`
      },
      datePicker: {
        label: 'Wybierz datę'
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
        body: n => `Czy jesteś pewien/na, że chcesz usunąć lek: ${n}?`
      },
      add: {
        title: 'Dodaj Lek',
        body: 'Wprowadź informacje o nowym leku.'
      }
    },
    taken: {
      delete: {
        title: 'Usuń wzięcie',
        body: n => `Czy jesteś pewien/na, że chcesz usunąć wzięcie leku: ${n}`
      }
    }
  }
}

export default dict
