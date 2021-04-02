import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { getSupervisorSessionData } from '../database/schema/Supervisor'
import { IsAuthReturn, SupervisionAuthReqBody, SupervisionAuthRes } from '../../shared/api/auth'
import { mockDev } from '../security'
import { validateUUID } from '../database/types'
import { AuthSupervision } from '../database/schema/Supervision'

class Auth extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/isauth`, (req, res) => {
      mockDev(req)

      console.info('AUthing')

      if (req.session.user_id) {
        getSupervisorSessionData(req.session.user_id)
          .then(data => {
            console.dir(data)
            res.send(
              JSON.stringify({
                isAuth: true,
                data
              } as IsAuthReturn)
            )
          })
          .catch(e => {
            console.error(e)
            res.send(
              JSON.stringify({
                isAuth: false
              } as IsAuthReturn)
            )
          })
      } else res.send(JSON.stringify({ isAuth: false } as IsAuthReturn))
    })

    s.post(`${prefix}/supervision/auth`, (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id } = req.body as SupervisionAuthReqBody

      console.info(`[med. auth] ${supervisor_id}/${supervised_id}`)

      if (!supervisor_id)
        return res.status(403).send(
          JSON.stringify({
            ok: false,
            isAuth: false,
            message: 'No supervisor ID'
          } as SupervisionAuthRes)
        )

      if (!validateUUID(supervised_id))
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            isAuth: false,
            message: 'Invalid supervised ID'
          } as SupervisionAuthRes)
        )

      AuthSupervision(supervised_id, supervisor_id)
        .then(r =>
          res.status(r.ok ? 200 : 403).send(
            JSON.stringify({
              ok: true,
              isAuth: r.ok,
              supervised: r.ok ? r.supervised : null
            } as SupervisionAuthRes)
          )
        )
        .catch(e =>
          res.status(403).send(
            JSON.stringify({
              ok: false,
              isAuth: false,
              message: String(e)
            } as SupervisionAuthRes)
          )
        )
    })
  }
}

export const instance = new Auth()
