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

export interface MedicineGetTakenQueryReq {
  supervisor_id: UUID
  supervised_id: UUID
  date: string
}

export interface MedicineTake extends Medicine {
  date: string
  take_id: UUID
}

export interface MedicineLeft extends Medicine {
  date: string
}
