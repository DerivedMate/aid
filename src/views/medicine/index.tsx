import { SupervisionAuthReqBody, SupervisionAuthRes } from '%/api/auth'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { Typography } from '@material-ui/core'
import React, { ReactElement, useEffect, useReducer } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router'

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
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

// URL: .../medicine/:supervised_id
export const Elem = ({ locale }: DispatchProps): ReactElement => {
  const { supervised_id } = useParams<MatchProps>()

  const [state, dispatch] = useReducer(
    (state: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoAuthDenied:
          return { ...state, stage: Stage.AuthDenied, message: action.message, status: 403 }
        case LocalActionType.IntoAuthError:
          return { ...state, stage: Stage.AuthError, message: action.message, status: action.status }
        case LocalActionType.IntoAuthorized:
          return { ...state, stage: Stage.Authorized, status: 200 }
        default:
          return state
      }
    },
    {
      stage: Stage.Authorizing,
      message: '',
      status: 200
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
        const { ok, isAuth, message } = JSON.parse(j) as SupervisionAuthRes
        if (!isAuth && ok)
          return dispatch({
            type: LocalActionType.IntoAuthDenied,
            message
          })

        if (!isAuth && !ok)
          return dispatch({
            type: LocalActionType.IntoAuthError,
            message,
            status: r.status
          })

        if (isAuth)
          return dispatch({
            type: LocalActionType.IntoAuthorized
          })
      })
    })
  }, [])

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

  if (state.stage === Stage.Authorized) return <Typography variant='h5'>[PH] Authorized</Typography>
}

export default connect<DispatchProps>(mapProps)(Elem)
