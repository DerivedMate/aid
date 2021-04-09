import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { mockDev } from '../security'
import { validateUUID } from '../database/types'
import {
  createAdditionalInfo,
  getAdditionalInfo,
  getSupervisedInfo,
  updateAdditionalInfo,
  updateSupervisedInfo
} from '../database/schema/Info'
import {
  GetInfoReqBody,
  GetInfoRes,
  SaveInfoReqBody,
  SaveInfoRes,
  SaveInfoResFail,
  SaveInfoResSuccess
} from '../../shared/api/info'

class Info extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/info`, (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id } = req.body as GetInfoReqBody

      console.info(`[Info/all] ${supervisor_id}/${supervised_id}`)

      if (!supervisor_id)
        return res.status(401).send(
          JSON.stringify({
            ok: false,
            message: 'No supervisor ID'
          } as GetInfoRes)
        )

      if (!validateUUID(supervised_id))
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            message: 'Invalid supervised ID'
          } as GetInfoRes)
        )

      Promise.all([getSupervisedInfo(supervised_id), getAdditionalInfo(supervised_id)])
        .then(([[ok, r], a]) => {
          if (ok) {
            return res.status(200).send(
              JSON.stringify({
                ok: true,
                info: r,
                additional: a
              } as GetInfoRes)
            )
          }

          return res.status(404).send(
            JSON.stringify({
              ok: false,
              message: String(r)
            } as GetInfoRes)
          )
        })
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as GetInfoRes)
          )
        )
    })

    s.put(`${prefix}/info/save`, (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id, info, additional }: SaveInfoReqBody = req.body as SaveInfoReqBody

      console.info(`[Info/save] ${supervisor_id}/${supervised_id}`)

      if (!supervisor_id)
        return res.status(401).send(
          JSON.stringify({
            ok: false,
            message: 'No supervisor ID'
          } as SaveInfoRes)
        )

      if (!validateUUID(supervised_id))
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            message: 'Invalid supervised ID'
          } as SaveInfoRes)
        )

      const addToCreate = additional.filter(a => !a.add_info_id)
      const addToUpdate = additional.filter(a => a.add_info_id)

      Promise.all([
        updateSupervisedInfo(supervised_id, info as any),
        updateAdditionalInfo(addToUpdate),
        createAdditionalInfo(supervised_id, addToCreate)
      ])
        .then(([ri, ru, ra]) => {
          const ruOk = ru === addToUpdate.length
          const raOk = ra === addToCreate.length

          const ok = ri && ruOk && raOk
          if (!ok)
            return res.status(500).send(
              JSON.stringify({
                ok,
                message: 'Saving failed'
              } as SaveInfoResFail)
            )

          Promise.all([getSupervisedInfo(supervised_id), getAdditionalInfo(supervised_id)]).then(([[ok, r], a]) => {
            if (ok) {
              return res.status(200).send(
                JSON.stringify({
                  ok: true,
                  info: r,
                  additional: a
                } as SaveInfoResSuccess)
              )
            }

            return res.status(404).send(
              JSON.stringify({
                ok: false,
                message: String(r)
              } as SaveInfoResFail)
            )
          })
        })
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as SaveInfoResFail)
          )
        )
    })
  }
}

export const instance = new Info()
