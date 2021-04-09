import { makeLocationUrl, Routes } from '@/app.routes'
import { AlertAction, AlertActionType, AppAlert } from '@/store/actions/alert'
import { State } from '@/store/reducers'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import React, { useState } from 'react'
import { Dispatch } from 'redux'
import { Redirect, useLocation } from 'react-router'
import { connect } from 'react-redux'
import { Locale } from '@/locale/model'
import { UUID } from '%/query/columnTypes'

interface DispatchProps {
  alerts: AppAlert[]
  locale: Locale
}

interface DispatchActions {
  stopAlert: (ed_id: UUID) => void
}

const mapActions = (dispatch: Dispatch): DispatchActions => ({
  stopAlert(supervised_id: UUID) {
    dispatch({
      type: AlertActionType.StopAlert,
      supervised_id
    } as AlertAction)
  }
})

const mapProps = (state: State): DispatchProps => ({
  alerts: state.alert.alerts,
  locale: state.lang.dict
})

const Elem = ({ alerts, stopAlert, locale }: DispatchProps & DispatchActions): React.ReactElement => {
  const [red, setRed] = useState(false)
  const location = useLocation()
  const active = !location.pathname.startsWith(Routes.LocationBase)

  if (alerts.length === 0 || !active) return <></>

  const alert = alerts[0]

  if (red) return <Redirect to={makeLocationUrl(alert.supervised.supervised_id)} />

  const handleClose = () => {
    stopAlert(alert.supervised.supervised_id)
  }

  const handleClick = () => {
    setRed(true)
  }

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>{locale.alert.title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant='h5'>
          {locale.alert.bodyNoDate(`${alert.supervised.name} ${alert.supervised.lastname}`)}
        </DialogContentText>
        <DialogContentText variant='body1'>{alert.time.toTimeString()}</DialogContentText>
        <DialogActions>
          <Button onClick={handleClose}>{locale.alert.ignore}</Button>
          <Button color='primary' onClick={handleClick}>
            {locale.alert.respond}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}

export default connect<DispatchProps, DispatchActions>(mapProps, mapActions)(Elem)
