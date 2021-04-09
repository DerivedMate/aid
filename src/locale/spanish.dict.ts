import { Locale } from './model'

const dict: Locale = {
  commonButtons: {
    learnMore: 'Leer más'
  },

  title: {
    home: 'Início',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    supervised: 'Supervisados',
    account: 'Cuenta',
    medications: 'Medicinas',
    location: 'Ubicación',
    health: 'Salud'
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
    signIn: 'Iniciar sesión',
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
      button: 'Agregar',
      success: 'Se añadió un(a) supervisado/a con éxito'
    },

    delete: {
      body: (n: string): string => `¿Está usted seguro/a que usted quiere eliminar ${n} como un(a) supervisado/a?`
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
        left: 'No Tomadas',
        ariaLabel: 'Pestañas de Medicinas'
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
        body: (n: string): string => `¿Está usted seguro/a que usted quiere tomar: ${n}?`
      },
      datePicker: {
        label: 'Escoger una Fecha'
      },
      alter: {
        empty: 'No se encontró nada',
        error: (m: string): string => `Había un error:\n${m}`,
        authError: (m: string): string => `Acceso denegado:\n${m}`
      },
      loading: {
        loadingMedicine: 'Cargando Medicinas',
        authorizing: 'Autenticando'
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
        body: (n: string): string => `¿Está usted seguro/a que usted quiere eliminar: ${n}?`
      },
      add: {
        title: 'Añadir una Medicina',
        body: 'Inserte información sobre una nueva medicina.'
      }
    },
    taken: {
      delete: {
        title: 'Eliminar la Tomada',
        body: (n: string): string => `¿Está usted seguro/a que usted quiere eliminar una tomada de: ${n}?`
      }
    }
  },

  account: {
    logout: 'Terminar sesión'
  },

  alert: {
    title: '¡Alerta!',
    body: (n: string, t: string): string => `${n} encontró algunos problemas circa ${t}. Necesitaría su ayuda.`,
    bodyNoDate: (n: string): string => `${n} encontró algunos problemas. Necesitaría su ayuda.`,
    trigger: 'Simular Alerta',
    ignore: 'Ignorar',
    respond: 'Responder'
  },

  info: {
    name: 'Nombre',
    bloodType: 'El grupo sanguíneo',
    hcNumber: 'Número de la tarjeta de salud',
    lastname: 'Apellido',
    info: 'Información primaria',
    additional: 'Informacje dodatkowe',
    key: 'Clave',
    value: 'Valor',
    add: 'Añadir',
    details: 'Información sobre salud',
    save: 'Guardar',
    edit: 'Editar'
  },

  call: {
    retry: 'Intentar de nuevo',
    calling: 'Conectando',
    inCall: 'Conectado',
    call: 'Conectar'
  },

  location: {
    stageButton: {
      fetchingWard: 'Descargando la posición del / la supervisado/a', // 'Pobieranie Pozycji Podopiecznego/nej',
      fetchingRoute: 'Descargando la Ruta',
      retryFetching: 'Intentar a descargar de nuevo',
      acceptReq: 'Acepte la solicitud de posición',
      reCalcRoute: 'Calcular la Ruta de Nuevo',
      calcRoute: 'Calcular la Ruta',
      cancelRoute: 'Cancelar la Ruta'
    },

    map: {
      dist: 'Distancia',
      duration: 'Duración',
      yourPosition: 'Su Posición'
    },

    error: {
      routeFetching: 'Error mientras descargando la ruta'
    }
  }
}

export default dict
