import { Express } from 'express-serve-static-core'

export abstract class EndPoint {
  mount(_server: Express, _prefix: string): void {}
}
