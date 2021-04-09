import { UUID } from '%/query/columnTypes'
import { SupervisedListDisplay } from '%/query/supervised'

export enum AlertActionType {
  StartAlert = '@Alert:Action:StartAlert',
  StopAlert = '@Alert:Action:StopAlert'
}

interface AlertActionStart {
  type: AlertActionType.StartAlert
  supervised: SupervisedListDisplay
  time: Date
}

interface AlertActionStop {
  type: AlertActionType.StopAlert
  supervised_id: UUID
}

export type AlertAction = AlertActionStart | AlertActionStop

export interface AppAlert {
  supervised: SupervisedListDisplay
  time: Date
}

export interface AlertState {
  alerts: AppAlert[]
}
