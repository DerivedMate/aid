import { UUID } from '%/query/columnTypes'
import { AdditionalInfo, SupervisedInfoRes } from '%/query/info'

export interface GetInfoReqBody {
  supervised_id: UUID
}

//#region
interface GetInfoResSuccess {
  ok: true
  info: SupervisedInfoRes
  additional: AdditionalInfo[]
}

interface GetInfoResFail {
  ok: false
  message: string
}
//#endregion

export type GetInfoRes = GetInfoResFail | GetInfoResSuccess

export interface SaveInfoReqBody {
  supervised_id: UUID
  info: SupervisedInfoRes
  additional: AdditionalInfo[]
}

interface SaveInfoResSuccess {
  ok: true
  info: SupervisedInfoRes
  additional: AdditionalInfo[]
}

interface SaveInfoResFail {
  ok: false
  message: string
}

export type SaveInfoRes = SaveInfoResSuccess | SaveInfoResFail
