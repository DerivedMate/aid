import { SupervisionAuthReqBody, SupervisionAuthRes } from '%/api/auth'
import { SupervisedListDisplay } from '%/query/supervised'
import { Routes } from '@/app.routes'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { AppBar, IconButton, makeStyles, Tab, Tabs, Toolbar, Typography } from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import { TabPanel } from '@material-ui/lab'
import React, { ReactElement, useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

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

const localStyles_ = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `'header' 'tabs' 'content'`,
    gridTemplateRows: `auto auto 1fr`,
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      margin: '0 auto'
    }
  },

  topBar: {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[2],
    gridArea: 'header'
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
    color: theme.palette.grey[700]
  },

  TabsList: {
    width: '100%'
  }
}))

// URL: .../medicine/:supervised_id
export const Elem = ({ locale }: DispatchProps): ReactElement => {
  const { supervised_id } = useParams<MatchProps>()
  const localStyles = localStyles_()

  const [state, dispatch] = useReducer(
    (state: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoAuthDenied:
          return { ...state, stage: Stage.AuthDenied, message: action.message, status: 403 }
        case LocalActionType.IntoAuthError:
          return { ...state, stage: Stage.AuthError, message: action.message, status: action.status }
        case LocalActionType.IntoAuthorized:
          return { ...state, stage: Stage.Authorized, status: 200, supervised: action.supervised }
        default:
          return state
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

      r.text().then(j => {
        const res = JSON.parse(j) as SupervisionAuthRes
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
      })
    })
  }, [])

  const [tabNr, changeTabNr] = useState(0)
  const handleTabChange = (_: React.ChangeEvent<{}>, v: number) => {
    changeTabNr(v)
  }

  if (state.stage === Stage.Authorizing) return <Loader title='[PH] Authorizing' />

  if (state.stage === Stage.AuthDenied)
    return (
      <Typography variant='h5'>
        [PH] Access Denied: ({state.status}) {state.message}
      </Typography>
    )

  if (state.stage === Stage.AuthError)
    return (
      <Typography variant='h5'>
        [PH] Authentication Error: ({state.status}) {state.message}
      </Typography>
    )

  if (state.stage === Stage.Authorized)
    return (
      <>
        <div className={localStyles.root}>
          <AppBar component='header' position='static' className={localStyles.topBar}>
            <Toolbar>
              <IconButton edge='start' component={Link} to={Routes.Supervised}>
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Typography variant='h6' className={localStyles.topBarTitle}>
                [PH] Medicine
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
          <AppBar position='static' className={localStyles.TabsRoot}>
            <Tabs
              value={tabNr}
              onChange={handleTabChange}
              indicatorColor='primary'
              variant='fullWidth'
              scrollButtons='auto'
              aria-label='[PH] Medicine tabs'
              className={localStyles.TabsList}
            >
              <Tab value={0} label='[PH] All' />
              <Tab value={1} label='[PH] Taken' />
              <Tab value={2} label='[PH] Left' />
            </Tabs>
          </AppBar>
        </div>
      </>
    )
}

export default connect<DispatchProps>(mapProps)(Elem)
