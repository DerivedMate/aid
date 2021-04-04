import { UUID } from '../../../shared/query/columnTypes'

declare module 'express-session' {
  interface SessionData {
    user_id: UUID
  }
}
