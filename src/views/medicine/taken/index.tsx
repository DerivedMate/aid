import {
  MedicineDate,
  MedicineGetTakenReqBody,
  MedicineGetTakenRes,
  MedicineReqAllBody,
  MedicineResAll
} from '%/api/medicine'
import { UUID } from '%/query/columnTypes'
import { Medicine, MedicineTake } from '%/query/medicine'
import Loader from '@/components/loader'
import { getApiBase } from '@/helpers/url'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { listed } from '@/styles/ts/common'
import { Collapse, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import React, { useEffect, useReducer, useState } from 'react'
import { connect } from 'react-redux'

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
  medicines: MedicineTake[]
}

interface LocalActionChangeData {
  type: LocalActionType.ChangeDate
  date: MedicineDate
}

type LocalAction = LocalActionIntoLoadingFail | LocalActionIntoDisplay | LocalActionChangeData

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const styles_ = listed

const Elem = ({ locale, supervised_id }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = styles_()
  const today = new Date()

  const [state, dispatch] = useReducer(
    (state: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoLoadingFail:
          return { ...state, stage: Stage.LoadingFail, message: action.message, status: action.status }
        case LocalActionType.IntoDisplay:
          return { ...state, stage: Stage.Display, medicines: action.medicines }
        case LocalActionType.ChangeDate:

        default:
          return state
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

  const [refetchFlag, setRefetchFlag] = useState([0])
  useEffect(() => {
    fetch(`${getApiBase()}/medicine/taken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id,
        date: state.date
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
  }, refetchFlag)

  const handleEditResult = () => {
    setRefetchFlag([refetchFlag[0] + 1])
  }

  const [openListItemNr, setOpenListItem] = useState(-1)
  const handleListClick = (v: number) => (_: React.ChangeEvent<{}>): void => {
    setOpenListItem(v === openListItemNr ? -1 : v)
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

  if (state.stage === Stage.Display)
    return (
      <div className={styles.container}>
        <List component='ul' className={styles.fullCard}>
          {state.medicines.length === 0 ? (
            <Typography variant='h5' color='textSecondary'>
              [PH] No medicine found
            </Typography>
          ) : (
            state.medicines.map(({ medicine_id, name, amount, unit, current, year, month, day }, i) => (
              <ListItem className={styles.fullCard} key={i}>
                <List className={styles.fullCard}>
                  <ListItem button onClick={handleListClick(i)} className={styles.topItem}>
                    <ListItemText
                      primary={name}
                      secondary={`${amount} ${unit}. ${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
                        2,
                        '0'
                      )}`}
                    />
                  </ListItem>
                  <Collapse in={openListItemNr === i} timeout='auto' unmountOnExit>
                    <List component='ul' className={styles.subItem}>
                      <ListItem button className={styles.listItemDanger}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary='[PH] Delete' color='warning' />
                      </ListItem>
                    </List>
                  </Collapse>
                </List>
              </ListItem>
            ))
          )}
        </List>
      </div>
    )
}

export default connect<DispatchProps>(mapProps)(Elem)
