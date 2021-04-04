import { SupervisorNoPass } from 'shared/query/supervisor'
import { UUID } from '%/query/columnTypes'
import { SupervisedListDisplay } from '%/query/supervised'

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

interface SupervisionAuthResNoAuth {
  ok: boolean
  isAuth: false
  message?: string
}

interface SupervisionAuthResAuth {
  ok: true
  isAuth: true
  supervised: SupervisedListDisplay
  message?: string
}

export type SupervisionAuthRes = SupervisionAuthResNoAuth | SupervisionAuthResAuth
