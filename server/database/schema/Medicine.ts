import { UUID } from '../../../shared/query/columnTypes'
import { Medicine } from '../../../shared/query/medicine'
import { query } from '../db'

export const getAllMedicine = (supervised_id: UUID, supervisor_id: UUID): Promise<Medicine[]> =>
  /* 
    Query from `supervision` to ensure that only users connected through `supervision` can access this information 
  */
  query(
    `
    select 
      m.medicine_id, 
      m.supervised_id, 
      m.name, 
      m.amount, 
      m.unit, 
      m.current
    from 
      supervision sn
    inner join medicine m using (supervised_id)
    where 
      sn.supervised_id = $1 and
      sn.supervisor_id = $2;
    `,
    [supervised_id, supervisor_id]
  ).then(r => r.rows as Medicine[])
