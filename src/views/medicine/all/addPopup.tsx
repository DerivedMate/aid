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
import AddIcon from '@material-ui/icons/Add'
import React, { ChangeEventHandler, useReducer } from 'react'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { connect } from 'react-redux'
import { listed } from '@/styles/ts/common'
import { MedicineCreateReqBody, MedicineCreateRes } from '%/api/medicine'
import { UUID } from '%/query/columnTypes'

enum Stage {
  Hidden = '@Medicine:All:AddPopUp:Hidden',
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
  supervised_id: UUID

  onResult: () => void
}

enum ActionType {
  IntoHidden = '@Medicine:All:AddPopUp:Action:IntoHidden',
  IntoWaiting = '@Medicine:All:AddPopUp:Action:IntoWaiting',
  IntoResult = '@Medicine:All:AddPopUp:Action:IntoResult',
  IntoDisplayed = '@Medicine:All:AddPopUp:Action:IntoDisplayed',
  onInput = '@Medicine:All:AddPopUp:Action:onInput'
}

interface ActionIntoWaiting {
  type: ActionType.IntoWaiting
}

interface ActionIntoHidden {
  type: ActionType.IntoHidden
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

type Action = ActionOnInput | ActionIntoWaiting | ActionIntoResult | ActionIntoDisplayed | ActionIntoHidden

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

const Elem = ({ onResult, supervised_id, locale }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = listed()
  const [state, dispatch] = useReducer(
    (prev: LocalState = defaultState, action: Action) => {
      switch (action.type) {
        case ActionType.onInput:
          return { ...prev, [action.key]: action.data }
        case ActionType.IntoWaiting:
          return { ...prev, stage: Stage.Waiting }
        case ActionType.IntoResult:
          return {
            ...prev,
            stage: Stage.Result,
            device_id: '',
            ok: action.ok,
            message: action.message
          }
        case ActionType.IntoDisplayed:
          return { ...prev, stage: Stage.Displayed }
        case ActionType.IntoHidden:
          return { ...prev, stage: Stage.Hidden }
        default:
          return prev
      }
    },
    { ...defaultState, stage: Stage.Hidden }
  )

  const handleOpenClick = () => {
    dispatch({
      type: ActionType.IntoDisplayed
    })
  }

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

    fetch(`${getApiBase()}/medicine/create`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id,
        name: state.name,
        amount: state.amount,
        unit: state.unit
      } as MedicineCreateReqBody)
    })
      .then(async r => {
        const message: string = await r
          .text()
          .then(JSON.parse)
          .then((j: MedicineCreateRes) => ('message' in j ? j.message : r.statusText))
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

  const handleClose = () =>
    dispatch({
      type: ActionType.IntoHidden
    })

  const saveDisabled = state.name === '' || state.unit === ''

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

  // if (state.stage === Stage.Displayed)
  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>{locale.medicine.all.add.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{locale.medicine.all.add.body}</DialogContentText>
        <TextField
          margin='dense'
          id='name'
          label={locale.medicine.all.edit.name}
          type='text'
          fullWidth
          required
          onChange={handleChange('name')}
          value={state.name}
        />
        <TextField
          margin='dense'
          id='unit'
          label={locale.medicine.all.edit.unit}
          type='text'
          fullWidth
          required
          onChange={handleChange('unit')}
          value={state.unit}
        />
        <TextField
          margin='dense'
          id='amount'
          label={locale.medicine.all.edit.amount}
          type='number'
          fullWidth
          required
          onChange={handleChange('amount')}
          value={state.amount}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{locale.medicine.common.button.cancel}</Button>
        <Button disabled={saveDisabled} onClick={handleSubmitClick}>
          {locale.medicine.common.button.add}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
