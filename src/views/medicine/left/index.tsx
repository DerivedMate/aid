import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'
import { MedicineLeft } from '%/query/medicine'
import { UUID } from '%/query/columnTypes'
import { MedicineDate, MedicineGetLeftReqBody, MedicineGetLeftRes } from '%/api/medicine'
import TakeConfirmPopup from '../all/takeConfirmPopup'

enum Stage {
  Loading = '@Medicine:All:Stage:Loading',
  Display = '@Medicine:All:Stage:Display',
  LoadingFail = '@Medicine:All:Stage:LoadingFail'
}

interface LocalState {
  stage: Stage
  message: string
  status: number
  medicines: MedicineLeft[]
  date: MedicineDate
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
  medicines: MedicineLeft[]
}

interface LocalActionChangeData {
  type: LocalActionType.ChangeDate
  date: MedicineDate
}

type LocalAction = LocalActionIntoLoadingFail | LocalActionIntoDisplay | LocalActionChangeData

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ locale, supervised_id }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = listed()
  const today = new Date()

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
      date: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate()
      }
    }
  )

  const [refetchFlag, setRefetchFlag] = useState(false)
  const refetch = () => setRefetchFlag(!refetchFlag)

  useEffect(() => {
    fetch(`${getApiBase()}/medicine/left`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id,
        date: state.date
      } as MedicineGetLeftReqBody)
    }).then(r => {
      r.text().then(j => {
        const res = JSON.parse(j) as MedicineGetLeftRes

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

  const [openListItemNr, setOpenListItem] = useState(-1)
  const [currentMedicine, setCurrentMedicine] = useState(state.medicines.length > 0 ? state.medicines[0] : null)
  const handleListClick = (v: number) => (): void => {
    if (v === openListItemNr) {
      setOpenListItem(-1)
      setCurrentMedicine(null)
    } else {
      setOpenListItem(v)
      setCurrentMedicine(v in state.medicines ? state.medicines[v] : null)
    }
  }

  const [confirmOpen, setConfirmOpen] = useState(false)
  const handleCloseConfirm = () => {
    setConfirmOpen(false)
    refetch()
  }

  const handleTakeClick = (i: number) => () => {
    setCurrentMedicine(state.medicines[i])
    setConfirmOpen(true)
  }

  const [rawDate, setRawDate] = useState(new Date())
  const handleDateChange = (d: Date | null) => {
    if (d) {
      setRawDate(d)
      dispatch({
        type: LocalActionType.ChangeDate,
        date: {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate()
        }
      })
    }
  }

  if (state.stage === Stage.Loading)
    return (
      <div className={styles.container}>
        <Loader title='[PH] Loading medicines' />
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
          <Typography variant='h5' color='textSecondary'>
            [PH] No medicine found
          </Typography>
        ) : (
          state.medicines.map(({ medicine_id, name, amount, unit }, i) => (
            <ListItem className={styles.fullCard} key={medicine_id}>
              <List className={styles.fullCard}>
                <ListItem button onClick={handleListClick(i)} className={styles.topItem}>
                  <ListItemText primary={name} secondary={`${amount} ${unit}.`} />
                </ListItem>
                <Collapse in={openListItemNr === i} timeout='auto' unmountOnExit>
                  <List component='ul' className={styles.subItem}>
                    <ListItem button onClick={handleTakeClick(i)}>
                      <ListItemIcon>
                        <LocalHospitalIcon />
                      </ListItemIcon>
                      <ListItemText primary={locale.medicine.common.button.take} className={styles.camouflagedLink} />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            </ListItem>
          ))
        )}
      </List>
      {confirmOpen && (
        <TakeConfirmPopup
          onResult={refetch}
          handleClose={handleCloseConfirm}
          medicine_id={currentMedicine.medicine_id}
          name={currentMedicine.name}
          supervised_id={supervised_id}
          date={+rawDate}
        />
      )}
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
