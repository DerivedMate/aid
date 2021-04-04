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
  },

  medicine: {
    common: {
      topBar: {
        title: 'Medicinas'
      },
      tabs: {
        all: 'Todas',
        taken: 'Tomadas',
        left: 'No Tomadas'
      },
      button: {
        take: 'Tomar',
        edit: 'Editar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        add: 'Añadir'
      },
      take: {
        title: 'Tomar la Medicina',
        body: name => `¿Está usted seguro/a que usted quiere tomar: ${name}?`
      }
    },

    all: {
      edit: {
        title: 'Editar la Medicina',
        body: 'Aquí usted puede editar información sobre esta medicina.',
        name: 'El Nombre',
        unit: 'La Unidad',
        amount: 'La cantidad'
      },
      delete: {
        title: 'Eliminar la Medicina',
        body: name => `¿Está usted seguro/a que usted quiere eliminar: ${name}?`
      },
      add: {
        title: 'Añadir una Medicina',
        body: 'Inserte información sobre una nueva medicina.'
      }
    },
    taken: {
      delete: {
        title: 'Eliminar la Tomada',
        body: name => `¿Está usted seguro/a que usted quiere eliminar una tomada de: ${name}?`
      }
    }
  }
}

export default dict
