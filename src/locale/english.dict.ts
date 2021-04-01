import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Read more'
  },

  home: {
    toAbout: {
      title: 'Aid',
      subtitle: 'Better. Faster. Safer.',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, soluta.'
    }
  },

  dashboard: {
    toSupervised: {
      title: 'Supervised',
      body:
        'Here you will find information regarding the location, health details, and the medicine taken by your wards',
      button: 'Go to supervised'
    }
  },

  menu: {
    home: 'Home',
    about: 'About',
    signIn: 'Sign In',
    supervised: 'Supervised',
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
        location: 'Location',
        medications: 'Medications'
      }
    },

    add: {
      title: 'Add a ward',
      body: 'Insert the device ID, which can be found on the back side of the device or on the warranty card.',
      fieldLabel: 'Device ID',
      button: 'Add'
    }
  }
}

export default dict
