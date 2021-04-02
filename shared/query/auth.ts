import { SupervisedListDisplay } from './supervised'

interface SupervisionAuthQuerySuccess {
  ok: true
  supervised: SupervisedListDisplay
}

interface SupervisionAuthQueryFail {
  ok: false
}

export type SupervisionAuthQuery = SupervisionAuthQuerySuccess | SupervisionAuthQueryFail
