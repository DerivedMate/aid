import { UUID } from '%/query/columnTypes'
import { Medicine, MedicineTake } from '%/query/medicine'

export interface MedicineReqAllBody {
  supervised_id: UUID
}

interface MedicineResAllSuccess {
  ok: true
  medicine: Medicine[]
}

interface MedicineResAllFail {
  ok: false
  message: string
}

export type MedicineResAll = MedicineResAllFail | MedicineResAllSuccess

// TODO: Merge if needed
interface MedicineResUpdateFail {
  ok: false
  message: string
}

interface MedicineResUpdateSuccess {
  ok: true
  message: string
}

export interface MedicineDate {
  year: number
  month: number
  day: number
}

export interface MedicineGetTakenReqBody {
  supervised_id: UUID
  date: MedicineDate
}

export type MedicineResUpdate = MedicineResUpdateSuccess | MedicineResUpdateFail

interface MedicineGetTakenResDenied {
  ok: false
  isValidSupervised: boolean
}

interface MedicineGetTakenResSuccess {
  ok: true
  medicines: MedicineTake[]
}

interface MedicineGetTakenResError {
  ok: false
  message: string
}

export type MedicineGetTakenRes = MedicineGetTakenResDenied | MedicineGetTakenResSuccess | MedicineGetTakenResError
