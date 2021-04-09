import { LangAction } from './lang'
import { UserAction } from './user'
import { AlertState } from './alert'

export type Action = UserAction | LangAction | AlertState
