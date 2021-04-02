import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { MedicineResAll } from '../../shared/api/medicine'
import { validateUUID } from '../database/types'
import { mockDev } from '../security'
import { getAllMedicine } from '../database/schema/Medicine'

class Endpoint extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/medicine/all`, (req, res) => {
      mockDev(req)
      console.info(`[med. request]: ${req.session.user_id}`)

      if (!req.session.user_id) {
        return res.sendStatus(403)
      }

      const supervisor_id = req.session.user_id
      const { supervised_id } = req.body

      if (!validateUUID(supervised_id)) return res.sendStatus(400)

      getAllMedicine(supervised_id, supervisor_id)
        .then(m =>
          res.status(200).send(
            JSON.stringify({
              ok: true,
              medicine: m
            } as MedicineResAll)
          )
        )
        .catch(e =>
          res.status(404).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as MedicineResAll)
          )
        )
    })
  }
}

export const instance = new Endpoint()
