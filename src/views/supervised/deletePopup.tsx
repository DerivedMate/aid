import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'
import { SupervisedListDisplay } from '%/query/supervised'
import { SupervisedRemoveReqBody, SupervisedRemoveRes } from '%/api/supervised'

enum Stage {
  Display,
  Waiting,
  Result
}

interface LocalState {
  stage: Stage
  ok: boolean
  status: number
  message: string
}

enum LocalActionType {
  IntoWaiting,
  IntoResult
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
  supervised: SupervisedListDisplay

  handleClose: () => void
  onResult: () => void
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ handleClose, supervised, onResult, locale }: LocalProps & DispatchProps): React.ReactElement => {
  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction): LocalState => {
      switch (action.type) {
        case LocalActionType.IntoWaiting:
          return { ...prev, stage: Stage.Waiting }
        case LocalActionType.IntoResult:
          return { ...prev, stage: Stage.Result, ok: action.ok, status: action.status, message: action.message }
        default:
          return prev
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

    fetch(`${getApiBase()}/supervised/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id: supervised.supervised_id
      } as SupervisedRemoveReqBody)
    })
      .then(r =>
        r
          .text()
          .then(JSON.parse)
          .then((res: SupervisedRemoveRes) => {
            dispatch({
              type: LocalActionType.IntoResult,
              ok: res.ok,
              message: res.ok === false ? res.message : r.statusText,
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
      .finally(() => onResult())
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

  // if (state.stage === Stage.Display)
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>{locale.medicine.all.delete.title}</DialogTitle>
      <DialogContent>
        [PH] Want to delete {supervised.name} {supervised.lastname}?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{locale.medicine.common.button.cancel}</Button>
        <Button color='primary' onClick={handleClick}>
          {locale.medicine.common.button.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
