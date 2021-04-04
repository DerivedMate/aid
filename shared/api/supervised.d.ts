import { UUID } from '%/query/columnTypes'
import { SupervisedListDisplay } from 'shared/query/supervised'

export interface SupervisedListSuccess {
  ok: true
  supervised: SupervisedListDisplay[]
}

export interface SupervisedListFail {
  ok: false
  supervised: []
  message: string
}

export type SupervisedListResult = SupervisedListSuccess | SupervisedListFail

export interface AddSupervisedReqBody {
  device_id: UUID
}

interface AddSupervisedResOk {
  ok: true
}

interface AddSupervisedResError {
  ok: false
  message: string
}

export type AddSupervisedRes = AddSupervisedResOk | AddSupervisedResError
