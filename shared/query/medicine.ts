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
  date: {
    year: number
    month: number
    day: number
  }
}

export interface MedicineTake extends Medicine {
  year: string
  month: string
  day: string
  take_id: UUID
}
