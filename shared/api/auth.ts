import { SupervisorNoPass } from 'shared/query/supervisor'

export interface isAuthSuccess {
  isAuth: true
  data: SupervisorNoPass
}

export interface isAuthFail {
  isAuth: false
}

export type isAuthReturn = isAuthFail | isAuthSuccess
