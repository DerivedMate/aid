import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { getSupervisorSessionData, SupervisorNoPass } from '../database/schema/Supervisor'

interface isAuthSuccess {
  isAuth: true
  data: SupervisorNoPass
}

interface isAuthFail {
  isAuth: false
}

type isAuthReturn = isAuthFail | isAuthSuccess

class Auth extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/isauth`, (req, res) => {
      if (process.env['NODE_ENV'] === 'development') req.session.user_id = '8f07ed92-38c9-4502-ae8d-bb8fb582c709'

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
