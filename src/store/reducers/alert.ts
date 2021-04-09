import { AlertAction, AlertActionType, AlertState } from '../actions/alert'

const DEFAULT: AlertState = {
  alerts: []
}

const alertReducer = (state: AlertState = DEFAULT, action: AlertAction): AlertState => {
  switch (action.type) {
    case AlertActionType.StartAlert:
      return {
        ...state,
        alerts: [
          ...state.alerts,
          {
            supervised: action.supervised,
            time: action.time
          }
        ]
      }
    case AlertActionType.StopAlert:
      return { ...state, alerts: state.alerts.filter(a => a.supervised.supervised_id !== action.supervised_id) }
    default:
      return state
  }
}

export default alertReducer
