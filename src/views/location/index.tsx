import { Routes } from '@/app.routes'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { SupervisedListDisplay } from '%/query/supervised'
import { SupervisionAuthReqBody, SupervisionAuthRes } from '%/api/auth'
import Map from './map'

interface MatchProps {
  supervised_id: string
}

enum Stage {
  Authorizing = '@Medicine:Main:Stage:Authorizing',
  Authorized = '@Medicine:Main:Stage:Authorized',
  AuthError = '@Medicine:Main:Stage:AuthError',
  AuthDenied = '@Medicine:Main:Stage:AuthDenied'
}

enum LocalActionType {
  IntoAuthorized = '@Medicine:Main:Action:IntoAuthorized',
  IntoAuthError = '@Medicine:Main:Action:IntoAuthError',
  IntoAuthDenied = '@Medicine:Main:Action:IntoAuthDenied'
}

// Actions
interface LocalActionIntoAuthorized {
  type: LocalActionType.IntoAuthorized
  supervised: SupervisedListDisplay
}

interface LocalActionIntoAuthError {
  type: LocalActionType.IntoAuthError
  message: string
  status: number
}

interface LocalActionIntoAuthDenied {
  type: LocalActionType.IntoAuthDenied
  message: string
}

type LocalAction = LocalActionIntoAuthorized | LocalActionIntoAuthError | LocalActionIntoAuthDenied

interface LocalState {
  stage: Stage
  message: string
  status: number
  supervised: SupervisedListDisplay | null
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const makeLocalStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `'header' 'tabs' 'content'`,
    gridTemplateRows: `auto auto 1fr`,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      margin: '0 auto'
    }
  },

  topBar: {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[2],
    width: '100%'
  },

  topBarTitle: {
    color: theme.palette.text.primary,
    marginRight: theme.spacing(3)
  },

  topBarSpace: {
    flexGrow: 1
  },

  topBarFirstName: {
    color: theme.palette.text.primary,
    textAlign: 'right'
  },

  topBarSecondName: {
    color: theme.palette.text.secondary,
    textAlign: 'right'
  },

  TabsRoot: {
    backgroundColor: theme.palette.grey[100],
    boxShadow: theme.shadows[1],
    color: theme.palette.grey[700],
    width: '100%'
  },

  TabsList: {
    width: '100%'
  },

  ContentRoot: {
    width: '100%',
    height: '100%',
    gridArea: 'content',
    paddingTop: theme.spacing(2),
    overflow: 'auto hidden',
    [theme.breakpoints.up('sm')]: {
      width: '500px'
    }
  }
}))

// URL: .../medicine/:supervised_id
export const Elem = ({ locale }: DispatchProps): ReactElement => {
  const { supervised_id } = useParams<MatchProps>()
  const localStyles = makeLocalStyles()

  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoAuthDenied:
          return { ...prev, stage: Stage.AuthDenied, message: action.message, status: 403 }
        case LocalActionType.IntoAuthError:
          return { ...prev, stage: Stage.AuthError, message: action.message, status: action.status }
        case LocalActionType.IntoAuthorized:
          return { ...prev, stage: Stage.Authorized, status: 200, supervised: action.supervised }
        default:
          return prev
      }
    },
    {
      stage: Stage.Authorizing,
      message: '',
      status: 200,
      supervised: null
    }
  )

  useEffect(() => {
    fetch(`${getApiBase()}/supervision/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        supervised_id
      } as SupervisionAuthReqBody)
    }).then(r => {
      if (!r.ok && r.status === 403)
        return r.text().then(j =>
          dispatch({
            type: LocalActionType.IntoAuthDenied,
            message: (JSON.parse(j) as SupervisionAuthRes).message || r.statusText
          })
        )

      if (!r.ok)
        return r
          .text()
          .then(j =>
            dispatch({
              type: LocalActionType.IntoAuthError,
              message: (JSON.parse(j) as SupervisionAuthRes).message || r.statusText,
              status: r.status
            })
          )
          .catch(e =>
            dispatch({
              type: LocalActionType.IntoAuthError,
              message: `${r.statusText};${String(e)}`,
              status: r.status
            })
          )

      return r
        .text()
        .then(JSON.parse)
        .then((res: SupervisionAuthRes) => {
          if (!res.isAuth && res.ok)
            return dispatch({
              type: LocalActionType.IntoAuthDenied,
              message: res.message
            })

          if (!res.isAuth && !res.ok)
            return dispatch({
              type: LocalActionType.IntoAuthError,
              message: res.message,
              status: r.status
            })

          if (res.isAuth)
            return dispatch({
              type: LocalActionType.IntoAuthorized,
              supervised: res.supervised
            })

          return {}
        })
    })
  }, [supervised_id])

  if (state.stage === Stage.Authorizing) return <Loader title={locale.medicine.common.loading.authorizing} />

  if (state.stage === Stage.AuthDenied)
    return (
      <Typography align='center' variant='h5'>
        {locale.medicine.common.alter.authError(`(${state.status}) ${state.message}`)}
      </Typography>
    )

  if (state.stage === Stage.AuthError)
    return (
      <Typography align='center' variant='h5'>
        {locale.medicine.common.alter.error(`(${state.status}) ${state.message}`)}
      </Typography>
    )

  // if (state.stage === Stage.Authorized)
  return (
    <>
      <Helmet>
        <title>{locale.title.location}</title>
      </Helmet>
      <div className={localStyles.root}>
        <AppBar component='header' position='static' className={localStyles.topBar}>
          <Toolbar>
            <IconButton edge='start' component={Link} to={Routes.Supervised}>
              <KeyboardArrowLeftIcon />
            </IconButton>
            <Typography variant='h6' className={localStyles.topBarTitle}>
              [PH] Location
            </Typography>
            <div className={localStyles.topBarSpace} />
            <div>
              <Typography variant='h6' className={localStyles.topBarFirstName}>
                {state.supervised.name}
              </Typography>
              <Typography variant='subtitle2' className={localStyles.topBarSecondName}>
                {state.supervised.lastname}
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
        <section className={localStyles.ContentRoot}>
          <Map supervised={state.supervised} />
        </section>
      </div>
    </>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
