import { EndPoint, MOCK_USER_ID } from './_common'
import { Express } from 'express-serve-static-core'
import { getSupervisedList } from '../database/schema/Supervised'
import { SupervisedListResult } from '../../shared/api/supervised'

class Supervised extends EndPoint {
  mount(s: Express, prefix: string) {
    s.get(`${prefix}/supervised/list`, (req, res) => {
      if (process.env['NODE_ENV'] === 'development') req.session.user_id = MOCK_USER_ID

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
  }
}

export const instance = new Supervised()
