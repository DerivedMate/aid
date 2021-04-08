import { UUID } from '../../../shared/query/columnTypes'
import { query } from '../db'

export const createTake = (medicine_id: UUID, date: string): Promise<boolean> =>
  query(
    `
    insert into take 
      ( medicine_id
      , date
      )
    values
      ( $1
      , $2
      );
    `,
    [medicine_id, date]
  ).then(r => r.rowCount === 1)

export const validateSupervisorTakeAuth = (take_id: UUID, supervisor_id: UUID): Promise<boolean> =>
  query(
    `
        select t.date
        from 
          take t,
          medicine m,
          supervision sn
        where
          t.take_id        = $1               and
          t.medicine_id    = m.medicine_id    and
          m.supervised_id  = sn.supervised_id and
          sn.supervisor_id = $2;
      `,
    [take_id, supervisor_id]
  )
    .then(r => r.rows.length === 1)
    .catch(e => {
      console.error(`[ValidateSupervisorTakeAuth Query Error]: ${e}`)
      return false
    })

export const deleteTake = (take_id: UUID): Promise<boolean> =>
  query(
    `
      delete from take
      where take_id = $1;
      `,
    [take_id]
  ).then(r => r.rowCount === 1)
