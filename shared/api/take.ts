import { UUID } from '%/query/columnTypes'

export interface CreateTakeReqBody {
  supervised_id: UUID
  medicine_id: UUID
}

interface CreateTakeResInvalid {
  ok: false
  isValidSupervised: boolean
  isValidMedicine: boolean
}

interface CreateTakeResDenied {
  ok: false
  auth: false
}

interface CreateTakeResError {
  ok: false
  message: string
}

interface CreateTakeResResult {
  ok: boolean
}

export type CreateTakeRes = CreateTakeResInvalid | CreateTakeResDenied | CreateTakeResResult | CreateTakeResError

export interface DeleteTakeReqBody {
  take_id: UUID
}

interface DeleteTakeResError {
  ok: false
  isAuth: boolean
  message: string
}

interface DeleteTakeResAny {
  ok: boolean
  isAuth: boolean
}

export type DeleteTakeRes = DeleteTakeResAny | DeleteTakeResError
