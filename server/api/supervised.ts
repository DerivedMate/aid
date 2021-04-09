import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { createSupervision, getSupervisedList, removeSupervision } from '../database/schema/Supervised'
import {
  SupervisedListResult,
  AddSupervisedReqBody,
  AddSupervisedRes,
  SupervisedRemoveReqBody,
  SupervisedRemoveResFail,
  SupervisedRemoveResSuccess
} from '../../shared/api/supervised'
import { validateUUID } from '../database/types'
import { mockDev } from '../security'
import { AuthSupervision } from '../database/schema/Supervision'

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

    s.delete(`${prefix}/supervised/delete`, async (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id } = req.body as SupervisedRemoveReqBody

      if (!supervisor_id)
        return res.status(401).send(
          JSON.stringify({
            ok: false,
            message: 'No supervisor ID'
          } as SupervisedRemoveResFail)
        )

      if (!validateUUID(supervised_id))
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            message: 'Invalid supervised ID'
          } as SupervisedRemoveResFail)
        )

      const auth = await AuthSupervision(supervised_id, supervisor_id).catch(e => {
        console.error(e)
        return { ok: false }
      })

      if (!auth.ok)
        return res.status(403).send(
          JSON.stringify({
            ok: false,
            message: 'Access Denied'
          } as SupervisedRemoveResFail)
        )

      removeSupervision(supervisor_id, supervised_id)
        .then(r => {
          if (!r)
            return res.status(500).send(
              JSON.stringify({
                ok: false,
                message: 'Query Error'
              } as SupervisedRemoveResFail)
            )

          return res.status(200).send(
            JSON.stringify({
              ok: true
            } as SupervisedRemoveResSuccess)
          )
        })
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as SupervisedRemoveResFail)
          )
        )
    })
  }
}

export const instance = new Supervised()
