import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { mockDev } from '../security'

class LogOut extends EndPoint {
  mount(s: Express, prefix: string) {
    s.delete(`${prefix}/logout`, (req, res) => {
      mockDev(req)

      if (req.session.user_id) {
        req.session.user_id = undefined
        return res.sendStatus(200)
      }

      return res.sendStatus(400)
    })
  }
}

export const instance = new LogOut()
