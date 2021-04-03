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
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { connect } from 'react-redux'
import { Medicine, MedicineUpdateReq } from '%/query/medicine'
import { MedicineResUpdate } from '%/api/medicine'

enum Stage {
  Displayed = '@Medicine:All:AddPopUp:Displayed',
  Waiting = '@Medicine:All:AddPopUp:Waiting',
  Result = '@Medicine:All:AddPopUp:Result'
}

interface LocalState {
  ok: boolean
  message: string
  stage: Stage
  name: string
  unit: string
  amount: number
}

interface LocalProps {
  title: string
  body: string
  medicine: Medicine

  handleClose: () => void
  onResult: () => void
}

enum ActionType {
  IntoWaiting = '@Medicine:All:AddPopUp:Action:IntoWaiting',
  IntoResult = '@Medicine:All:AddPopUp:Action:IntoResult',
  IntoDisplayed = '@Medicine:All:AddPopUp:Action:IntoDisplayed',
  onInput = '@Medicine:All:AddPopUp:Action:onInput'
}

interface ActionIntoWaiting {
  type: ActionType.IntoWaiting
}

interface ActionIntoResult {
  type: ActionType.IntoResult
  ok: boolean
  message?: string
}

interface ActionIntoDisplayed {
  type: ActionType.IntoDisplayed
}

type DataKey = 'name' | 'unit' | 'amount'

interface ActionOnInput {
  type: ActionType.onInput
  key: DataKey
  data: string
}

type Action = ActionOnInput | ActionIntoWaiting | ActionIntoResult | ActionIntoDisplayed

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const defaultState: LocalState = {
  ok: true,
  message: '',
  stage: Stage.Displayed,
  name: '',
  unit: '',
  amount: 0
}

const styles_ = listed

const Elem = ({
  onResult,
  body,
  title,
  locale,
  handleClose,
  medicine
}: LocalProps & DispatchProps): React.ReactElement => {
  const styles = styles_()

  const { name, unit, amount } = medicine

  const [state, dispatch] = useReducer(
    (state: LocalState = defaultState, action: Action) => {
      switch (action.type) {
        case ActionType.onInput:
          return { ...state, [action.key]: action.data }
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
        case ActionType.IntoDisplayed:
          return { ...state, stage: Stage.Displayed }
        default:
          return state
      }
    },
    { ...defaultState, stage: Stage.Displayed, name, unit, amount }
  )

  const handleChange = (key: DataKey): ChangeEventHandler => e => {
    dispatch({
      type: ActionType.onInput,
      key,
      data: (e.currentTarget as HTMLInputElement).value.trim()
    })
  }

  const handleSubmitClick = () => {
    dispatch({
      type: ActionType.IntoWaiting
    })

    fetch(`${getApiBase()}/medicine/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        medicine_id: medicine.medicine_id,
        supervised_id: medicine.supervised_id,
        name: state.name,
        amount: state.amount,
        unit: state.unit
      } as MedicineUpdateReq)
    })
      .then(async r => {
        const message: string = await r
          .text()
          .then(JSON.parse)
          .then(j => ('message' in j ? j.message : r.statusText))
          .catch(e => `${String(e)}; (${r.status}) ${r.statusText}`)

        dispatch({
          type: ActionType.IntoResult,
          ok: r.ok,
          message
        })

        onResult()
      })
      .catch(e => {
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

  const saveDisabled = state.name === '' || state.unit === ''

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
            margin='dense'
            id='name'
            label='[PH] Name'
            type='text'
            fullWidth
            required
            onChange={handleChange('name')}
            value={state.name}
          />
          <TextField
            margin='dense'
            id='unit'
            label='[PH] Unit'
            type='text'
            fullWidth
            required
            onChange={handleChange('unit')}
            value={state.unit}
          />
          <TextField
            margin='dense'
            id='amount'
            label='[PH] Amount'
            type='number'
            fullWidth
            required
            onChange={handleChange('amount')}
            value={state.amount}
          />
        </DialogContent>
        <DialogActions>
          <Button color='secondary'>[PH] Delete</Button>
          <Button disabled={saveDisabled} onClick={handleSubmitClick}>
            [PH] Save
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default connect<DispatchProps>(mapProps)(Elem)
