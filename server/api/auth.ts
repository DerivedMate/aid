import { EndPoint, MOCK_USER_ID } from './_common'
import { Express } from 'express-serve-static-core'
import { getSupervisorSessionData } from '../database/schema/Supervisor'
import { isAuthReturn } from '../../shared/api/auth'

class Auth extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/isauth`, (req, res) => {
      if (process.env['NODE_ENV'] === 'development') req.session.user_id = MOCK_USER_ID

      if (req.session.user_id) {
        getSupervisorSessionData(req.session.user_id)
          .then(data => {
            console.dir(data)
            res.send(
              JSON.stringify({
                isAuth: true,
                data
              } as isAuthReturn)
            )
          })
          .catch(e => {
            console.error(e)
            res.send(
              JSON.stringify({
                isAuth: false
              } as isAuthReturn)
            )
          })
      } else res.send(JSON.stringify({ isAuth: false } as isAuthReturn))
    })
  }
}

export const instance = new Auth()
