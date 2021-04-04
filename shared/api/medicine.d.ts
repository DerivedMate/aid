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

export interface MedicineDeleteReqBody {
  supervised_id: UUID
  medicine_id: UUID
}

interface MedicineDeleteResAny {
  ok: boolean
  isAuth: boolean
}

interface MedicineDeleteResError extends MedicineDeleteResAny {
  message: string
}

interface MedicineDeleteResDenied extends MedicineDeleteResAny {
  isSupervisedValid: boolean
  isMedicineValid: boolean
}

export type MedicineDeleteRes = MedicineDeleteResAny | MedicineDeleteResError | MedicineDeleteResDenied

export interface MedicineCreateReqBody {
  supervised_id: UUID
  name: string
  unit: string
  amount: number
}

interface MedicineCreateResAny {
  ok: boolean
  isAuth: boolean
}

interface MedicineCreateResError extends MedicineCreateResAny {
  ok: false
  message: string
}

interface MedicineCreateResDenied extends MedicineCreateResAny {
  isAuth: false
  isSupervisedValid: boolean
}

export type MedicineCreateRes = MedicineCreateResAny | MedicineCreateResError | MedicineCreateResDenied

interface MedicineGetLeftResDenied {
  ok: false
  isValidSupervised: boolean
}

interface MedicineGetLeftResSuccess {
  ok: true
  medicines: MedicineTake[]
}

interface MedicineGetLeftResError {
  ok: false
  message: string
}

export type MedicineGetLeftRes = MedicineGetLeftResDenied | MedicineGetLeftResSuccess | MedicineGetLeftResError

export type MedicineGetLeftReqBody = MedicineGetTakenReqBody
