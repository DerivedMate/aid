import { UUID } from '../../../shared/query/columnTypes'
import { MedicineUpdateReq, Medicine } from '../../../shared/query/medicine'
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
      sn.supervisor_id = $2 and
      m.current        = 't'
      ;
    `,
    [supervised_id, supervisor_id]
  ).then(r => r.rows as Medicine[])

export const updateMedicine = ({ medicine_id, name, unit, amount }: MedicineUpdateReq): Promise<boolean> =>
  query(
    `
      update medicine
      set 
        name = $2,
        unit = $3,
        amount = $4::INTEGER
      where
        medicine_id = $1;
      `,
    [medicine_id, name, unit, String(amount)]
  ).then(r => r.rowCount === 1)
