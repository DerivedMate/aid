import { UUID } from './columnTypes'

export interface Medicine {
  medicine_id: UUID
  supervised_id: UUID
  name: string
  amount: number
  unit: string
  current: boolean
}

export interface MedicineUpdateReq {
  supervised_id: UUID
  medicine_id: UUID
  name: string
  amount: number
  unit: string
}
