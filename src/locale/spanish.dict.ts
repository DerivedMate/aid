import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Leer más'
  },

  home: {
    toAbout: {
      title: 'Aid',
      subtitle: 'Mejor. Más rápido. Más seguro.',
      body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, soluta.'
    }
  },

  dashboard: {
    toSupervised: {
      title: 'Supervisados',
      body:
        'Aquí usted puede encontrar informaciones sobre las ubicaciones, los datos de salud y las medicinas tomadas por sus pupilos.',
      button: 'Ir a supervisados'
    }
  },

  menu: {
    home: 'Inicio',
    about: 'Sobre la Ap.',
    signIn: 'Registrarse',
    supervised: 'Supervisados',
    account: 'Cuenta'
  },

  signIn: {
    email: 'E-mail',
    password: 'Contraseña',
    remember: 'Recuérdeme',
    signIn: 'Iniciar sesión',
    forgotPassword: '¿Ha olvidado su contraseña?',
    noAccount: '¿Aún no tiene usted una cuenta?'
  },

  signUp: {
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'E-mail',
    password: 'Contraseña',
    signUp: 'Registrarse',
    forgotPassword: '¿Ha olvidado su contraseña?',
    alreadyAccount: '¿Ya tiene used una cuenta?'
  },

  supervised: {
    list: {
      pageTitle: 'Lista de Supervisados',
      item: {
        healthDetail: 'Datos de Salud',
        location: 'Ubicación',
        medications: 'Medicinas'
      }
    },

    add: {
      title: 'Agregar un(a) Supervisado/a',
      body:
        'Inserte el número de identificación, el cual se puede encontrar en la parte trasera del dispositivo o en la tarjeta de garantía.',
      fieldLabel: 'Número de Identificación',
      button: 'Agregar'
    }
  }
}

export default dict
