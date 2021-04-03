import { EndPoint } from './_common'
import { Express } from 'express-serve-static-core'
import {
  MedicineResAll,
  MedicineResUpdate,
  MedicineGetTakenRes,
  MedicineGetTakenReqBody,
  MedicineDeleteReqBody,
  MedicineDeleteRes
} from '../../shared/api/medicine'
import { validateUUID } from '../database/types'
import { mockDev } from '../security'
import {
  deleteMedicine,
  getAllMedicine,
  getTakenMedicine,
  updateMedicine,
  validateSupervisionMedicineConnection
} from '../database/schema/Medicine'
import { MedicineUpdateReq } from '../../shared/query/medicine'
import { AuthSupervision } from '../database/schema/Supervision'

class Endpoint extends EndPoint {
  mount(s: Express, prefix: string) {
    s.post(`${prefix}/medicine/all`, (req, res) => {
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

    s.post(`${prefix}/medicine/taken`, (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const b = req.body as MedicineGetTakenReqBody

      if (!supervisor_id) return res.sendStatus(403)

      const isValidSupervised = validateUUID(b.supervised_id)
      if (!isValidSupervised)
        return res.status(400).send(JSON.stringify({ ok: false, isValidSupervised } as MedicineGetTakenRes))

      getTakenMedicine({
        supervisor_id,
        supervised_id: b.supervised_id,
        date: b.date
      })
        .then(r =>
          res.send(
            JSON.stringify({
              ok: true,
              medicines: r
            } as MedicineGetTakenRes)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as MedicineGetTakenRes)
          )
        )
    })

    s.put(`${prefix}/medicine/edit`, async (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const medicine = req.body as MedicineUpdateReq

      if (!supervisor_id) return res.sendStatus(403)

      const isSupervisorAuth = await AuthSupervision(medicine.supervised_id, supervisor_id)
        .then(r => r.ok)
        .catch(() => false)

      if (!isSupervisorAuth)
        res.status(403).send(
          JSON.stringify({
            ok: false,
            message: 'Unauthorized edition'
          } as MedicineResUpdate)
        )

      updateMedicine(medicine)
        .then(r =>
          res.status(r ? 201 : 500).send(
            JSON.stringify({
              ok: r,
              message: 'Edited'
            } as MedicineResUpdate)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              message: String(e)
            } as MedicineResUpdate)
          )
        )
    })

    s.delete(`${prefix}/medicine/delete`, async (req, res) => {
      mockDev(req)

      const supervisor_id = req.session.user_id
      const { supervised_id, medicine_id } = req.body as MedicineDeleteReqBody

      if (!supervisor_id) return res.sendStatus(403)

      const isSupervisedValid = validateUUID(supervised_id),
        isMedicineValid = validateUUID(medicine_id)

      if (!isSupervisedValid || !isMedicineValid)
        return res.status(403).send(
          JSON.stringify({
            ok: false,
            isAuth: false,
            isMedicineValid,
            isSupervisedValid
          } as MedicineDeleteRes)
        )

      const isAuth = await validateSupervisionMedicineConnection(supervisor_id, supervised_id, medicine_id).catch(e => {
        console.error(`[medicine/delete connectionAuthError] ${e}`)
        return false
      })

      if (!isAuth)
        return res.status(403).send(
          JSON.stringify({
            ok: false,
            isAuth: false,
            isMedicineValid,
            isSupervisedValid
          } as MedicineDeleteRes)
        )

      return deleteMedicine(medicine_id)
        .then(r =>
          res.status(r ? 200 : 406).send(
            JSON.stringify({
              ok: r,
              isAuth: true
            } as MedicineDeleteRes)
          )
        )
        .catch(e =>
          res.status(500).send(
            JSON.stringify({
              ok: false,
              isAuth: true,
              message: String(e)
            } as MedicineDeleteRes)
          )
        )
    })
  }
}

export const instance = new Endpoint()
