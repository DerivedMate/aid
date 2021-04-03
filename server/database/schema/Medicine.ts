import { MedicineDate } from '../../../shared/api/medicine'
import { UUID } from '../../../shared/query/columnTypes'
import { MedicineUpdateReq, Medicine, MedicineGetTakenQueryReq, MedicineTake } from '../../../shared/query/medicine'
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
    order by m.name ASC;
      ;
    `,
    [supervised_id, supervisor_id]
  ).then(r => r.rows as Medicine[])

export const getTakenMedicine = ({
  supervisor_id,
  supervised_id,
  date
}: MedicineGetTakenQueryReq): Promise<MedicineTake[]> =>
  query(
    `
      select 
        m.medicine_id, 
        m.supervised_id, 
        m.name, 
        m.amount, 
        m.unit, 
        m.current,
        date_part('year', t.date) as year,
        date_part('month', t.date) as month,
        date_part('day', t.date) as day,
        t.take_id
      from 
        take t, 
        supervision sn, 
        medicine m
      where 
        -- Join
        t.medicine_id    = m.medicine_id and
        m.supervised_id  = sn.supervised_id and 
        -- Match credentials 
        sn.supervisor_id = $1 and
        sn.supervised_id = $2 
        -- Match date
        and t.date::date = $3::date ;
        ;
      `,
    [
      supervisor_id,
      supervised_id,
      `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
    ]
  ).then(r => r.rows as MedicineTake[])

export const getTakenMedicineDates = (supervised_id: UUID): Promise<MedicineDate[]> =>
  query(
    `
    select 
      date_part('year', A.date) as year,
      date_part('month', A.date) as month,
      date_part('day', A.date) as day
    from (
      select 
        DISTINCT ON (date::date) date
      from 
        medicine m,
        take t
      where 
        t.medicine_id    = m.medicine_id   and
        m.supervised_id  = $1 
    ) as A
    `,
    [supervised_id]
  ).then(r => r.rows as MedicineDate[])

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

export const validateSupervisionMedicineConnection = (
  supervisor_id: UUID,
  supervised_id: UUID,
  medicine_id: UUID
): Promise<boolean> =>
  query(
    `
      select COUNT(*) cnt
      from supervision sn
      inner join medicine m using (supervised_id)
      where 
        sn.supervisor_id = $1 and
        sn.supervised_id = $2 and
        m.medicine_id    = $3;
      `,
    [supervisor_id, supervised_id, medicine_id]
  ).then(r => r.rows.length > 0)
