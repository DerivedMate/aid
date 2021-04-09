import React from 'react'
import PriorityHighIcon from '@material-ui/icons/PriorityHigh'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { listed } from '@/styles/ts/common'
import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { Dispatch } from 'redux'
import { AlertAction, AlertActionType } from '@/store/actions/alert'
import { connect } from 'react-redux'
import { SupervisedListDisplay } from '%/query/supervised'

const showLocalNotification = (title: string, body: string, url?: string): void => {
  const options: NotificationOptions = {
    body,
    actions: [{ action: url, title: 'Go to' }],
    data: {
      url
    }
  }

  navigator.serviceWorker
    .getRegistration()
    .then(r => r && r.showNotification(title, options))
    .catch(e => {
      console.error(e)
    })
}

const onPressReg = () => {
  window.Notification.requestPermission()
    .then(notPerm => {
      if (notPerm !== 'granted') {
        throw new Error('Permission not granted for Notification')
      }
    })
    .catch(console.error)
}

navigator.serviceWorker.addEventListener('message', msg => {
  console.dir(msg)
})

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

interface DispatchActions {
  startAlert: (supervised: SupervisedListDisplay, time: Date) => void
}

const mapActions = (dispatch: Dispatch): DispatchActions => ({
  startAlert(supervised: SupervisedListDisplay, time: Date) {
    return dispatch({
      type: AlertActionType.StartAlert,
      supervised,
      time
    } as AlertAction)
  }
})

interface OwnProps {
  supervised: SupervisedListDisplay
}

const Elem = ({ supervised, startAlert, locale }: DispatchProps & DispatchActions & OwnProps) => {
  const styles = listed()

  console.log(locale.account)

  const handleClick = () => {
    const d = new Date()

    onPressReg()
    startAlert(supervised, d)
    showLocalNotification(
      locale.alert.title,
      locale.alert.body(`${supervised.name} ${supervised.lastname}`, d.toTimeString())
    )
  }

  return (
    <ListItem button className={styles.listItemDanger} onClick={handleClick}>
      <ListItemIcon>
        <PriorityHighIcon />
      </ListItemIcon>
      <ListItemText primary={`[DEV] ${locale.alert.trigger}`} color='warning' />
    </ListItem>
  )
}

export default connect<DispatchProps, DispatchActions>(mapProps, mapActions)(Elem)
