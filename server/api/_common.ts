import { Express } from 'express-serve-static-core'
import { UUID } from '../../shared/query/columnTypes'

export abstract class EndPoint {
  mount(_server: Express, _prefix: string): void {}
}

export const MOCK_USER_ID: UUID = '8f07ed92-38c9-4502-ae8d-bb8fb582c709'
