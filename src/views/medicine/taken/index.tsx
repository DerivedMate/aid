import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { MedicineTake } from '%/query/medicine'
import { UUID } from '%/query/columnTypes'
import { MedicineGetTakenReqBody, MedicineGetTakenRes } from '%/api/medicine'
import TakeDeletePopup from './takeDeletePopup'

enum Stage {
  Loading = '@Medicine:All:Stage:Loading',
  Display = '@Medicine:All:Stage:Display',
  LoadingFail = '@Medicine:All:Stage:LoadingFail'
}

interface LocalState {
  stage: Stage
  message: string
  status: number
  medicines: MedicineTake[]
  date: number
}

interface LocalProps {
  supervised_id: UUID
}

interface DispatchProps {
  locale: Locale
}

enum LocalActionType {
  IntoLoadingFail = '@Medicine:All:Action:IntoLoadingFail',
  IntoDisplay = '@Medicine:All:Action:IntoDisplay',
  ChangeDate = '@Medicine:All:Action:ChangeDate'
}

interface LocalActionIntoLoadingFail {
  type: LocalActionType.IntoLoadingFail
  message: string
  status: number
}

interface LocalActionIntoDisplay {
  type: LocalActionType.IntoDisplay
  medicines: MedicineTake[]
}

interface LocalActionChangeData {
  type: LocalActionType.ChangeDate
  date: number
}

type LocalAction = LocalActionIntoLoadingFail | LocalActionIntoDisplay | LocalActionChangeData

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ locale, supervised_id }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = listed()

  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction): LocalState => {
      switch (action.type) {
        case LocalActionType.IntoLoadingFail:
          return { ...prev, stage: Stage.LoadingFail, message: action.message, status: action.status }
        case LocalActionType.IntoDisplay:
          return { ...prev, stage: Stage.Display, medicines: action.medicines }
        case LocalActionType.ChangeDate:
          return { ...prev, date: action.date }
        default:
          return prev
      }
    },
    {
      stage: Stage.Loading,
      message: '',
      status: 200,
      medicines: [],
      date: Date.now()
    }
  )

  const [refetchFlag, setRefetchFlag] = useState(false)
  const refetch = () => setRefetchFlag(!refetchFlag)

  useEffect(() => {
    fetch(`${getApiBase()}/medicine/taken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id,
        date: new Date(state.date).toUTCString()
      } as MedicineGetTakenReqBody)
    }).then(r => {
      r.text().then(j => {
        const res = JSON.parse(j) as MedicineGetTakenRes

        if (r.ok && res.ok)
          return dispatch({
            type: LocalActionType.IntoDisplay,
            medicines: res.medicines
          })

        return dispatch({
          type: LocalActionType.IntoLoadingFail,
          status: r.status,
          message: j || r.statusText
        })
      })
    })
  }, [state.date, supervised_id, refetchFlag])

  useEffect(() => {}, [refetchFlag])

  const [currentTakeId, setCurrentTakeId] = useState('')

  const [openListItemNr, setOpenListItem] = useState(-1)
  const handleListClick = (v: number) => (): void => {
    if (v === openListItemNr) {
      setOpenListItem(-1)
      setCurrentTakeId('')
    } else {
      setOpenListItem(v)
      setCurrentTakeId(v in state.medicines ? state.medicines[v].take_id : '')
    }
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  const handleCloseDelete = () => {
    setDeleteOpen(false)
  }

  const handleDeleteClick = () => {
    setDeleteOpen(true)
  }

  const [rawDate, setRawDate] = useState(new Date())
  const handleDateChange = (d: Date | null) => {
    if (d) {
      setRawDate(d)
      dispatch({
        type: LocalActionType.ChangeDate,
        date: +d
      })
    }
  }

  if (state.stage === Stage.Loading)
    return (
      <div className={styles.container}>
        <Loader title={locale.medicine.common.loading.loadingMedicine} />
      </div>
    )

  if (state.stage === Stage.LoadingFail)
    return (
      <div className={styles.container}>
        {state.message}
        <br />
        {state.status}
      </div>
    )

  // if (state.stage === Stage.Display)
  return (
    <div className={styles.container}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='yyyy/MM/dd'
          margin='normal'
          id='date-picker-inline'
          label={locale.medicine.common.datePicker.label}
          value={rawDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
      </MuiPickersUtilsProvider>
      <List component='ul' className={styles.fullCard}>
        {state.medicines.length === 0 ? (
          <Typography variant='h5' align='center' color='textSecondary'>
            {locale.medicine.common.alter.empty}
          </Typography>
        ) : (
          state.medicines.map(({ take_id, name, amount, unit, date }, i) => (
            <ListItem className={styles.fullCard} key={take_id}>
              <List className={styles.fullCard}>
                <ListItem button onClick={handleListClick(i)} className={styles.topItem}>
                  <ListItemText primary={name} secondary={`${amount} ${unit}. ${new Date(date).toDateString()}`} />
                </ListItem>
                <Collapse in={openListItemNr === i} timeout='auto' unmountOnExit>
                  <List component='ul' className={styles.subItem}>
                    <ListItem button className={styles.listItemDanger} onClick={handleDeleteClick}>
                      <ListItemIcon>
                        <DeleteIcon />
                      </ListItemIcon>
                      <ListItemText primary={locale.medicine.common.button.delete} color='warning' />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </ListItem>
          ))
        )}
      </List>
      {deleteOpen && (
        <TakeDeletePopup
          name={openListItemNr in state.medicines ? state.medicines[openListItemNr].name : ''}
          take_id={currentTakeId || ''}
          handleClose={handleCloseDelete}
          onResult={refetch}
        />
      )}
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
