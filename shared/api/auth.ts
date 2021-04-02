import { UUID } from '%/query/columnTypes'
import { SupervisorNoPass } from 'shared/query/supervisor'

export interface IsAuthSuccess {
  isAuth: true
  data: SupervisorNoPass
}

export interface IsAuthFail {
  isAuth: false
}

export type IsAuthReturn = IsAuthFail | IsAuthSuccess

export interface SupervisionAuthReqBody {
  supervised_id: UUID
}

export interface SupervisionAuthRes {
  ok: boolean
  isAuth: boolean
  message?: string
}
