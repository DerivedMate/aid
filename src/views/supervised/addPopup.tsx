import { UUID } from '%/query/columnTypes'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import {
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  IconButton
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import React, { ChangeEventHandler, useReducer } from 'react'
import AddIcon from '@material-ui/icons/Add'
import { listed } from '@/styles/ts/common'

enum Stage {
  Displayed = '@Supervised:AddPopUp:Displayed',
  Waiting = '@Supervised:AddPopUp:Waiting',
  Hidden = '@Supervised:AddPopUp:Hidden',
  Result = '@Supervised:AddPopUp:Result'
}

interface LocalState {
  open: boolean
  ok: boolean
  message: string
  stage: Stage
  device_id: UUID
}

interface LocalProps {
  title: string
  body: string
  fieldLabel: string
  button: string
  open: boolean
  onResult: () => void
}

enum ActionType {
  IntoWaiting = '@Supervised:AddPopUp:Action:IntoWaiting',
  IntoResult = '@Supervised:AddPopUp:Action:IntoResult',
  IntoHidden = '@Supervised:AddPopUp:Action:IntoHidden',
  IntoDisplayed = '@Supervised:AddPopUp:Action:IntoDisplayed',
  onInput = '@Supervised:AddPopUp:Action:onInput'
}

interface ActionIntoWaiting {
  type: ActionType.IntoWaiting
}

interface ActionIntoResult {
  type: ActionType.IntoResult
  ok: boolean
  message?: string
}

interface ActionIntoHidden {
  type: ActionType.IntoHidden
}

interface ActionIntoDisplayed {
  type: ActionType.IntoDisplayed
}

interface ActionOnInput {
  type: ActionType.onInput
  data: string
}

type Action = ActionOnInput | ActionIntoWaiting | ActionIntoResult | ActionIntoHidden | ActionIntoDisplayed

const defaultState: LocalState = {
  open: false,
  ok: true,
  message: '',
  stage: Stage.Hidden,
  device_id: ''
}

const styles_ = listed

const Elem = ({ onResult, body, title, button, fieldLabel, open }: LocalProps): React.ReactElement => {
  const styles = styles_()
  const [state, dispatch] = useReducer(
    (state: LocalState = defaultState, action: Action) => {
      switch (action.type) {
        case ActionType.onInput:
          return { ...state, device_id: action.data }
        case ActionType.IntoWaiting:
          return { ...state, stage: Stage.Waiting }
        case ActionType.IntoResult:
          debugger
          return {
            ...state,
            stage: Stage.Result,
            device_id: '',
            ok: (action as ActionIntoResult).ok,
            message: (action as ActionIntoResult).message
          }
        case ActionType.IntoHidden:
          return { ...state, stage: Stage.Hidden, device_id: '', open: false }
        case ActionType.IntoDisplayed:
          return { ...state, stage: Stage.Displayed, open: true }
        default:
          return state
      }
    },
    { ...defaultState, open, stage: open ? Stage.Displayed : Stage.Hidden }
  )

  const handleChange: ChangeEventHandler = e => {
    dispatch({
      type: ActionType.onInput,
      data: (e.currentTarget as HTMLInputElement).value.trim()
    })
  }

  const handleSubmitClick = () => {
    dispatch({
      type: ActionType.IntoWaiting
    })

    fetch(`${getApiBase()}/supervised/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_id: state.device_id
      })
    })
      .then(r => {
        debugger
        if (r.ok) {
          dispatch({
            type: ActionType.IntoResult,
            ok: true,
            message: '[PH] Successfully added a ward'
          })
          onResult()
        } else {
          dispatch({
            type: ActionType.IntoResult,
            ok: false,
            message: r.statusText
          })
          onResult()
        }
      })
      .catch(e => {
        debugger
        dispatch({
          type: ActionType.IntoResult,
          ok: false,
          message: String(e)
        })
        onResult()
      })
  }

  const handleOpenClick = () => {
    dispatch({
      type: ActionType.IntoDisplayed
    })
  }

  const handleClose = () =>
    dispatch({
      type: ActionType.IntoHidden
    })

  if (state.stage === Stage.Hidden)
    return (
      <IconButton onClick={handleOpenClick} className={styles.buttonedTopLinkPositive}>
        <AddIcon />
      </IconButton>
    )
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
  if (state.stage === Stage.Displayed)
    return (
      <Dialog open onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='device_id'
            label={fieldLabel}
            type='text'
            fullWidth
            required
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={state.device_id === ''} onClick={handleSubmitClick}>
            {button}
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default Elem
