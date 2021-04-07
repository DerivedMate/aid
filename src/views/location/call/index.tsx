import { Locale } from '@/locale/model'
import { State } from '@/store/reducers'
import { ListItemText, ListItem, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import React, { useReducer } from 'react'
import { connect } from 'react-redux'

enum Stage {
  NoCall,
  Establishing,
  EstablishingError,
  InCall,
  CallError
}

enum LocalActionType {
  EstablishCall,
  IntoError,
  EstablishedCall,
  CancelCall,
  ClosePopup
}

interface LAEstablishingCall {
  type: LocalActionType.EstablishCall
}

interface LAIntoError {
  type: LocalActionType.IntoError
  stage: Stage.EstablishingError | Stage.CallError
  message: string
}

interface LAEstablishedCall {
  type: LocalActionType.EstablishedCall
  /*
     channel: WebRTCChannel
     */
}

interface LACancelCall {
  type: LocalActionType.CancelCall
}

interface LAClosePopup {
  type: LocalActionType.ClosePopup
}

type LocalAction = LACancelCall | LAEstablishedCall | LAEstablishingCall | LAIntoError | LAClosePopup

interface LocalState {
  stage: Stage
  error: {
    show: boolean
    message: string
  }
}

interface LocalProps {
  buttonClassName: string
}

interface DispatchProps {
  locale: Locale
}

const mapProps = (state: State): DispatchProps => ({
  locale: state.lang.dict
})

const Elem = ({ buttonClassName, locale }: LocalProps & DispatchProps): React.ReactElement => {
  const [state, dispatch] = useReducer(
    (prev: LocalState, action: LocalAction): LocalState => {
      switch (action.type) {
        case LocalActionType.CancelCall:
          return { ...prev, stage: Stage.NoCall }
        case LocalActionType.ClosePopup:
          return { ...prev, error: { ...prev.error, show: false } }
        case LocalActionType.IntoError:
          return { ...prev, stage: Stage.NoCall, error: { show: true, message: action.message } }
        case LocalActionType.EstablishCall:
          return { ...prev, stage: Stage.Establishing }
        case LocalActionType.EstablishedCall:
          return { ...prev, stage: Stage.InCall }
        default:
          return prev
      }
    },
    {
      stage: Stage.NoCall,
      error: {
        show: false,
        message: locale.menu.account // [PH]
      }
    }
  )

  const establishCall = (): Promise<void> =>
    new Promise(res => {
      setTimeout(res, 1000)
    })

  const handleClick = (): void => {
    switch (state.stage) {
      case Stage.Establishing:
        break

      case Stage.InCall:
        dispatch({
          type: LocalActionType.CancelCall
        })
        break

      default: {
        dispatch({
          type: LocalActionType.EstablishCall
        })

        establishCall()
          .then(() =>
            dispatch({
              type: LocalActionType.EstablishedCall
            })
          )
          .catch((message: string): void =>
            dispatch({
              type: LocalActionType.IntoError,
              stage: Stage.EstablishingError,
              message
            })
          )
        break
      }
    }
  }

  const handleClosePopUp = (): void =>
    dispatch({
      type: LocalActionType.ClosePopup
    })

  const buttonMessage = ((): string => {
    switch (state.stage) {
      case Stage.CallError:
      case Stage.EstablishingError:
        return '[PH] Retry'
      case Stage.Establishing:
        return '[PH] Calling'
      case Stage.InCall:
        return '[PH] In Call'
      default:
        return '[PH] Call'
    }
  })()

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={state.error.show}
        autoHideDuration={6000}
        onClose={handleClosePopUp}
      >
        <Alert severity='error' onClose={handleClosePopUp}>
          {state.error.message}
        </Alert>
      </Snackbar>
      <ListItem button className={buttonClassName} onClick={handleClick}>
        <ListItemText>{buttonMessage}</ListItemText>
      </ListItem>
    </>
  )
}

export default connect<DispatchProps>(mapProps)(Elem)
