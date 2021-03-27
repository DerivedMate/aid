import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { retrieveSupervisor } from '../database/schema/Supervisor'

class Signin extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/signin`, (req, res) => {
      const payload = req.body
      retrieveSupervisor(payload)
        .then(r => {
          req.session.user_id = r.supervisor_id
          console.dir(req.session)
          res.send(JSON.stringify(r))
        })
        .catch(e => {
          console.error(e)
          res.status(403).send(JSON.stringify(e))
        })
    })
  }
}

export const instance = new Signin()
