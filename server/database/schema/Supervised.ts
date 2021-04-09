import { UUID } from '../../../shared/query/columnTypes'
import { SupervisedListDisplay } from '../../../shared/query/supervised'
import { query } from '../db'

export const getSupervisedList = (supervisor_id: UUID): Promise<SupervisedListDisplay[]> =>
  query(
    `
    select
      sd.supervised_id,
      i.name,
      i.lastname
    from
      supervision sn
    inner join supervised sd using (supervised_id)
    inner join info i using (supervised_id)
    where sn.supervisor_id = $1
    order by 
      i.lastname ASC,
      i.name ASC
    ;
    `,
    [supervisor_id]
  ).then(r => r.rows as SupervisedListDisplay[])

export const createSupervision = (supervisor_id: UUID, device_id: UUID): Promise<UUID> =>
  query(
    `
      insert into supervision 
        ( supervisor_id
        , supervised_id
        )
      (select 
        $1,
        supervised_id
      from supervised
      where device_id = $2)
      returning supervision_id;
      `,
    [supervisor_id, device_id]
  ).then(r => {
    console.dir(r)
    return r.rows[0] as UUID
  })

export const removeSupervision = (supervisor_id: UUID, supervised_id: UUID): Promise<boolean> =>
  query(
    `
      delete from supervision
      where 
        supervisor_id = $1::uuid and
        supervised_id = $2::uuid ;
    `,
    [supervisor_id, supervised_id]
  ).then(r => r.rowCount === 1)
