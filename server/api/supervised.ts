import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { createSupervision, getSupervisedList } from '../database/schema/Supervised'
import { SupervisedListResult, AddSupervisedReqBody, AddSupervisedRes } from '../../shared/api/supervised'
import { validateUUID } from '../database/types'
import { mockDev } from '../security'

class Supervised extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/supervised/list`, (req, res) => {
      mockDev(req)

      if (!req.session.user_id) {
        return res.sendStatus(403)
      }

      console.info(`[list request]: ${req.session.user_id}`)

      const supervisor_id = req.session.user_id
      getSupervisedList(supervisor_id)
        .then(r =>
          res.send(
            JSON.stringify({
              ok: true,
              supervised: r
            } as SupervisedListResult)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              supervised: [],
              message: String(e)
            } as SupervisedListResult)
          )
        )
    })

    s.post(`${prefix}/supervised/add`, (req, res) => {
      mockDev(req)

      const { device_id } = req.body as AddSupervisedReqBody
      const supervisor_id = req.session.user_id

      debugger

      if (!supervisor_id)
        return res.status(403).send(
          JSON.stringify({
            ok: false,
            message: `Access denied: no supervisor id provided`
          } as AddSupervisedRes)
        )

      if (!validateUUID(device_id)) {
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            message: `Invalid device id (UUID): ${device_id}`
          } as AddSupervisedRes)
        )
      }

      createSupervision(supervisor_id, device_id)
        .then(() =>
          res.send(
            JSON.stringify({
              ok: true
            } as AddSupervisedRes)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: e
            } as AddSupervisedRes)
          )
        )
    })
  }
}

export const instance = new Supervised()
