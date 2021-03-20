import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'

class Signin extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/signin`, (req, res) => {})
  }
}

export const instance = new Signin()
