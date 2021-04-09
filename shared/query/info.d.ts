import { UUID } from './columnTypes'

export enum BloodType {
  Ap = 'A+',
  Am = 'A-',
  Bp = 'B+',
  Bm = 'B-',
  ABp = 'AB+',
  ABm = 'AB-',
  Op = 'O+',
  Om = 'O-'
}

export interface SupervisedEditReq {
  name: string
  lastname: string
  blood_type: BloodType
  hc_number: string
}

export interface SupervisedInfoRes {
  name: string
  lastname: string
  hc_number: BloodType
  blood_type: string
}

export type getInfoQRes = [true, SupervisedInfoRes] | [false, Error]

export interface AdditionalInfo {
  add_info_id: UUID
  key: string
  value: string
}
