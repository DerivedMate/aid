import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import { CreateTakeReqBody, CreateTakeRes } from '../../shared/api/take'
import { mockDev } from '../security'
import { validateUUID } from '../database/types'
import { validateSupervisionMedicineConnection } from '../database/schema/Medicine'
import { createTake } from '../database/schema/Take'

class Take extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/take/create`, async (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id, medicine_id } = req.body as CreateTakeReqBody

      if (!supervisor_id) return res.sendStatus(403)
      const isValidSupervised = validateUUID(supervised_id)
      const isValidMedicine = validateUUID(medicine_id)
      if (!isValidSupervised || !isValidMedicine)
        return res.status(400).send(
          JSON.stringify({
            ok: false,
            isValidMedicine,
            isValidSupervised
          } as CreateTakeRes)
        )

      const authConnection = await validateSupervisionMedicineConnection(
        supervisor_id,
        supervised_id,
        medicine_id
      ).catch(e => {
        console.dir(e)
        return false
      })

      if (!authConnection) return res.status(403).send(JSON.stringify({ ok: false, auth: false } as CreateTakeRes))

      createTake(medicine_id)
        .then(ok =>
          res.status(ok ? 201 : 500).send(
            JSON.stringify({
              ok
            } as CreateTakeRes)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as CreateTakeRes)
          )
        )
    })
  }
}

export const instance = new Take()
