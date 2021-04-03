import { CreateTakeReqBody, CreateTakeRes } from '%/api/take'
import { UUID } from '%/query/columnTypes'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'

enum Stage {
  Display = '@Medicine:All:Take:Stage:Display',
  Waiting = '@Medicine:All:Take:Stage:Waiting',
  Result = '@Medicine:All:Take:Stage:Result'
}

interface LocalState {
  stage: Stage
  ok: boolean
  status: number
  message: string
}

enum LocalActionType {
  IntoWaiting = '@Medicine:All:Take:Action:IntoWaiting',
  IntoResult = '@Medicine:All:Take:Action:IntoResult'
}

interface _LocalActionIntoWaiting {
  type: LocalActionType.IntoWaiting
}

interface _LocalActionIntoResult {
  type: LocalActionType.IntoResult
  ok: boolean
  status: number
  message: string
}

type LocalAction = _LocalActionIntoResult | _LocalActionIntoWaiting

interface LocalProps {
  medicine_id: UUID
  supervised_id: UUID

  handleClose: () => void
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ handleClose, supervised_id, medicine_id, locale }: LocalProps & DispatchProps): React.ReactElement => {
  const [state, dispatch] = useReducer(
    (state: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoWaiting:
          return { ...state, stage: Stage.Waiting }
        case LocalActionType.IntoResult:
          return { ...state, stage: Stage.Result, ok: action.ok, status: action.status, message: action.message }
        default:
          return state
      }
    },
    {
      ok: true,
      status: 200,
      message: '',
      stage: Stage.Display
    }
  )

  const handleClick = () => {
    dispatch({
      type: LocalActionType.IntoWaiting
    })

    fetch(`${getApiBase()}/take/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medicine_id,
        supervised_id
      } as CreateTakeReqBody)
    })
      .then(r =>
        r
          .text()
          .then(JSON.parse)
          .then((res: CreateTakeRes) => {
            dispatch({
              type: LocalActionType.IntoResult,
              ok: res.ok,
              message: 'message' in res ? res.message : r.statusText,
              status: r.status
            })
          })
          .catch(() => {
            dispatch({
              type: LocalActionType.IntoResult,
              ok: r.ok,
              message: r.statusText,
              status: r.status
            })
          })
      )
      .catch(e => {
        dispatch({
          type: LocalActionType.IntoResult,
          ok: false,
          message: String(e),
          status: 500
        })
      })
  }

  if (state.stage === Stage.Waiting) return <Loader />

  if (state.stage === Stage.Result)
    return (
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={state.ok ? 'success' : 'error'}>
          {state.message}
        </Alert>
      </Snackbar>
    )

  if (state.stage === Stage.Display)
    return (
      <Dialog open onClose={handleClose}>
        <DialogTitle>[PH] title</DialogTitle>
        <DialogContent>[PH] content</DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleClose}>
            [PH] cancel
          </Button>
          <Button color='primary' onClick={handleClick}>
            [PH] confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default connect<DispatchProps>(mapProps)(Elem)
