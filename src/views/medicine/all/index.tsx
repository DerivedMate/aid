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
import { Medicine } from '%/query/medicine'
import { UUID } from '%/query/columnTypes'
import { MedicineReqAllBody, MedicineResAll } from '%/api/medicine'
import EditPopup from './editPopUp'
import TakePopup from './takeConfirmPopup'
import DeletePopup from './medicineDeletePopup'
import AddPopup from './addPopup'

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

const Elem = ({ locale, supervised_id }: LocalProps & DispatchProps): React.ReactElement => {
  const styles = listed()
  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction) => {
      switch (action.type) {
        case LocalActionType.IntoLoadingFail:
          return { ...prev, stage: Stage.LoadingFail, message: action.message, status: action.status }
        case LocalActionType.IntoDisplay:
          return { ...prev, stage: Stage.Display, medicines: action.medicines }
        default:
          return prev
      }
    },
    {
      stage: Stage.Loading,
      message: '',
      status: 200,
      medicines: []
    }
  )

  const [refetchFlag, setRefetchFlag] = useState(false)

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
      r.text()
        .then(JSON.parse)
        .then((res: MedicineResAll) => {
          if (r.ok && res.ok)
            return dispatch({
              type: LocalActionType.IntoDisplay,
              medicines: res.medicine
            })

          return dispatch({
            type: LocalActionType.IntoLoadingFail,
            status: r.status,
            message: r.statusText
          })
        })
    })
  }, [refetchFlag, supervised_id])

  const handleEditResult = () => {
    setRefetchFlag(!refetchFlag)
  }

  const [openListItemNr, setOpenListItem] = useState(-1)
  const handleListClick = (v: number) => (): void => {
    setOpenListItem(v === openListItemNr ? -1 : v)
  }

  const [editOpen, setEditOpen] = useState(false)
  const [currentMedicine, setCurrentMedicine] = useState(state.medicines.length > 0 ? state.medicines[0] : null)

  const handleEditClick = (i: number) => () => {
    setCurrentMedicine(state.medicines[i])
    setEditOpen(true)
  }

  const [takeOpen, setTakeOpen] = useState(false)
  const handleTakeClick = (i: number) => () => {
    setCurrentMedicine(state.medicines[i])
    setTakeOpen(true)
  }

  const [deleteOpen, setDeleteOpen] = useState(false)
  const handleDeleteClick = (i: number) => () => {
    setCurrentMedicine(state.medicines[i])
    setDeleteOpen(true)
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
        <Typography variant='h5'>
          {state.status}
          <br />
          {state.message}
        </Typography>
      </div>
    )

  // if (state.stage === Stage.Display)
  return (
    <div className={styles.container}>
      <List component='ul' className={styles.fullCard}>
        {state.medicines.length === 0 ? (
          <Typography align='center' variant='h5' color='textSecondary'>
            {locale.medicine.common.alter.empty}
          </Typography>
        ) : (
          state.medicines.map(({ medicine_id, name, amount, unit }, i) => (
            <ListItem className={styles.fullCard} key={medicine_id}>
              <List className={styles.fullCard}>
                <ListItem button onClick={handleListClick(i)} className={styles.topItem}>
                  <ListItemText primary={name} secondary={`${amount} ${unit}`} />
                </ListItem>
                <Collapse in={openListItemNr === i} timeout='auto' unmountOnExit>
                  <List component='ul' className={styles.subItem}>
                    <ListItem button onClick={handleTakeClick(i)}>
                      <ListItemIcon>
                        <LocalHospitalIcon />
                      </ListItemIcon>
                      <ListItemText primary={locale.medicine.common.button.take} className={styles.camouflagedLink} />
                    </ListItem>
                    <ListItem button onClick={handleEditClick(i)}>
                      <ListItemIcon>
                        <EditIcon />
                      </ListItemIcon>
                      <ListItemText primary={locale.medicine.common.button.edit} className={styles.camouflagedLink} />
                    </ListItem>
                    <ListItem button className={styles.listItemDanger} onClick={handleDeleteClick(i)}>
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
      {editOpen && (
        <EditPopup
          handleClose={() => {
            setEditOpen(false)
          }}
          onResult={handleEditResult}
          medicine={currentMedicine}
        />
      )}
      {takeOpen && (
        <TakePopup
          handleClose={() => {
            setTakeOpen(false)
          }}
          supervised_id={supervised_id}
          medicine_id={currentMedicine.medicine_id}
          name={currentMedicine.name}
        />
      )}
      {deleteOpen && (
        <DeletePopup
          handleClose={() => {
            setDeleteOpen(false)
          }}
          onResult={handleEditResult}
          medicine_id={currentMedicine.medicine_id}
          name={currentMedicine.name}
          supervised_id={supervised_id}
        />
      )}
      <AddPopup onResult={() => setRefetchFlag(!refetchFlag)} supervised_id={supervised_id} />
    </div>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
