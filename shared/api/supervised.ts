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
