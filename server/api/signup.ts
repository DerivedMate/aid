import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { registerSupervisor } from '../database/schema/Supervisor'
import '../session'

class Signup extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/signup`, (req, res) => {
      const payload = req.body
      console.dir(payload)
      registerSupervisor(payload)
        .then(r => {
          res.sendStatus(r ? 200 : 406)
        })
        .catch(e => {
          res.status(403).send(JSON.stringify(e))
        })
    })
  }
}

export const instance = new Signup()
