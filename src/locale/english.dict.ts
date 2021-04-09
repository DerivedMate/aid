import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Read more'
  },

  title: {
    home: 'Home',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    supervised: 'Supervisees',
    account: 'Account',
    medications: 'Medications',
    location: 'Position',
    health: 'Salud'
  },

  home: {
    toAbout: {
      title: 'Aid Mate',
      subtitle: 'Safety always near you',
      body: ''
    }
  },

  dashboard: {
    toSupervised: {
      title: 'Supervisees',
      body:
        'Here you will find information regarding the position, health details, and the medicine taken by your wards',
      button: 'Go to Supervisees'
    }
  },

  menu: {
    home: 'Home',
    about: 'About',
    signIn: 'Sign In',
    supervised: 'Supervisees',
    account: 'Account'
  },

  signIn: {
    email: 'E-mail',
    password: 'Password',
    remember: 'Remember me',
    signIn: 'Sign in',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account yet?"
  },

  signUp: {
    firstName: 'Name(s)',
    lastName: 'Surname',
    email: 'E-mail',
    password: 'Password',
    signUp: 'Sign up',
    forgotPassword: 'Forgot your password?',
    alreadyAccount: 'Already have an account?'
  },

  supervised: {
    list: {
      pageTitle: 'List of Wards',
      item: {
        healthDetail: 'Health Details',
        location: 'Position',
        medications: 'Medications'
      }
    },

    add: {
      title: 'Add a ward',
      body: 'Insert the device ID, which can be found on the back side of the device or on the warranty card.',
      fieldLabel: 'Device ID',
      button: 'Add',
      success: 'Successfully added a ward'
    },

    delete: {
      body: (n: string): string => `Are you sure that you want to remove ${n} from your supervisees?`
    }
  },

  medicine: {
    common: {
      topBar: {
        title: 'Medications'
      },
      tabs: {
        all: 'All',
        taken: 'Taken',
        left: 'Left',
        ariaLabel: 'Medication Tabs'
      },
      button: {
        take: 'Take',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        add: 'Add'
      },
      take: {
        title: 'Take Medication',
        body: (n: string): string => `Are you sure you want to take: ${n}?`
      },
      datePicker: {
        label: 'Choose a Date'
      },
      alter: {
        empty: 'Nothing was found',
        error: (m: string): string => `An error arose:\n${m}`,
        authError: (m: string): string => `Access denied:\n${m}`
      },
      loading: {
        loadingMedicine: 'Loading Medications',
        authorizing: 'Authenticating'
      }
    },

    all: {
      edit: {
        title: 'Edit Medication',
        body: 'Here you can edit details of a given medication.',
        name: 'Name',
        unit: 'Unit',
        amount: 'Amount'
      },
      delete: {
        title: 'Delete Medication',
        body: (n: string): string => `Are you sure you want to delete: ${n}?`
      },
      add: {
        title: 'Add Medication',
        body: 'Insert the information about a new medication.'
      }
    },
    taken: {
      delete: {
        title: 'Delete a take',
        body: (n: string): string => `Are you sure you want to delete a take of: ${n}`
      }
    }
  },

  account: {
    logout: 'Log out'
  },

  alert: {
    title: 'Alert!',
    body: (n: string, t: string): string =>
      `${n} encountered some difficulties at ${t}, and is in need of your assistance.`,
    bodyNoDate: (n: string): string => `${n} encountered some difficulties, and is in need of your assistance.`,
    trigger: 'Trigger Alert',
    ignore: 'Ignore',
    respond: 'Respond'
  },

  info: {
    name: 'name',
    bloodType: 'Blood Type',
    hcNumber: 'Health Card Nr.',
    lastname: 'Surname',
    info: 'Primary Info.',
    additional: 'Additional Info.',
    key: 'Key',
    value: 'Value',
    add: 'Add',
    details: 'Health Details',
    save: 'Save',
    edit: 'Edit'
  },

  call: {
    retry: 'Re-try',
    calling: 'Calling',
    inCall: 'In Call',
    call: 'Call'
  },

  location: {
    stageButton: {
      fetchingWard: "Fetching Supervisee's Position",
      fetchingRoute: 'Fetching Route',
      retryFetching: 'Retry Fetching',
      acceptReq: 'Accept Location Request',
      reCalcRoute: 'Re-Calc. Route',
      calcRoute: 'Calc. Route',
      cancelRoute: 'Cancel Route'
    },

    map: {
      dist: 'Distance',
      duration: 'Duration',
      yourPosition: 'Your Position'
    },

    error: {
      routeFetching: 'Error Fetching Route'
    }
  }
}

export default dict
