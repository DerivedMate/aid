import { MedicineReqAllBody, MedicineResAll } from '%/api/medicine'
import { UUID } from '%/query/columnTypes'
import { Medicine } from '%/query/medicine'
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
import EditPopup from './addPopup'

enum Stage {
  Loading = '@Medicine:All:Stage:Loading',
  Display = '@Medicine:All:Stage:Display',
  LoadingFail = '@Medicine:All:Stage:LoadingFail'
}

interface LocalState {
  stage: Stage
  message: string
  status: number
  medicines: Medicine[]
}

interface LocalProps {
  supervised_id: UUID
}

interface DispatchProps {
  locale: Locale
}

enum LocalActionType {
  IntoLoadingFail = '@Medicine:All:Action:IntoLoadingFail',
  IntoDisplay = '@Medicine:All:Action:IntoDisplay'
}

interface LocalActionIntoLoadingFail {
  type: LocalActionType.IntoLoadingFail
  message: string
  status: number
}

interface LocalActionIntoDisplay {
  type: LocalActionType.IntoDisplay
  medicines: Medicine[]
}

type LocalAction = LocalActionIntoLoadingFail | LocalActionIntoDisplay

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const styles_ = listed

const Elem = ({ locale, supervised_id }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = styles_()
  const [state, dispatch] = useReducer(
    (state: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoLoadingFail:
          return { ...state, stage: Stage.LoadingFail, message: action.message, status: action.status }
        case LocalActionType.IntoDisplay:
          return { ...state, stage: Stage.Display, medicines: action.medicines }
        default:
          return state
      }
    },
    {
      stage: Stage.Loading,
      message: '',
      status: 200,
      medicines: []
    }
  )

  const [refetchFlag, setRefetchFlag] = useState([])
  useEffect(() => {
    fetch(`${getApiBase()}/medicine/all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supervised_id
      } as MedicineReqAllBody)
    }).then(r => {
      r.text().then(j => {
        const res = JSON.parse(j) as MedicineResAll

        if (r.ok && res.ok)
          return dispatch({
            type: LocalActionType.IntoDisplay,
            medicines: res.medicine
          })

        return dispatch({
          type: LocalActionType.IntoLoadingFail,
          status: r.status,
          message: j || r.statusText
        })
      })
    })
  }, refetchFlag)

  const [openListItemNr, setOpenListItem] = useState(-1)
  const handleListClick = (v: number) => (_: React.ChangeEvent<{}>): void => {
    setOpenListItem(v === openListItemNr ? -1 : v)
  }

  const [editOpen, setEditOpen] = useState(false)
  const [currentMedicine, setCurrentMedicine] = useState(state.medicines.length > 0 ? state.medicines[0] : null)

  const handleEditClick = (i: number) => () => {
    setCurrentMedicine(state.medicines[i])
    setEditOpen(true)
  }

  if (state.stage === Stage.Loading)
    return (
      <div className={styles.container}>
        <Loader title='[PH] Loading medicines' />
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
            state.medicines.map(({ medicine_id, name, amount, unit, current }, i) => (
              <ListItem className={styles.fullCard} key={i}>
                <List className={styles.fullCard}>
                  <ListItem button onClick={handleListClick(i)} className={styles.topItem}>
                    <ListItemText primary={name} secondary={`${amount} ${unit}`} />
                  </ListItem>
                  <Collapse in={openListItemNr === i} timeout='auto' unmountOnExit>
                    <List component='ul' className={styles.subItem}>
                      <ListItem button>
                        <ListItemIcon>
                          <LocalHospitalIcon />
                        </ListItemIcon>
                        <ListItemText primary='[PH] Take' className={styles.camouflagedLink} />
                      </ListItem>
                      <ListItem button onClick={handleEditClick(i)}>
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary='[PH] Edit' className={styles.camouflagedLink} />
                      </ListItem>
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
        {editOpen && (
          <EditPopup
            handleClose={() => {
              setEditOpen(false)
            }}
            onResult={() => {}}
            body='[PH] body'
            title='[PH] Edit medicine'
            medicine={currentMedicine}
          />
        )}
      </div>
    )
}

export default connect<DispatchProps>(mapProps)(Elem)
