import { UUID } from '../../../shared/query/columnTypes'
import { SupervisionAuthQuery } from '../../../shared/query/auth'
import { query } from '../db'
import { SupervisedListDisplay } from '../../../shared/query/supervised'

export const AuthSupervision = (supervised_id: UUID, supervisor_id: UUID): Promise<SupervisionAuthQuery> =>
  query(
    `
    select 
      supervised_id,
      name,
      lastname
    from supervision
    inner join info using (supervised_id)
    where 
      supervised_id = $1 and
      supervisor_id = $2;
    `,
    [supervised_id, supervisor_id]
  ).then(r => {
    if (r.rows.length === 0)
      return {
        ok: false
      }
    return {
      ok: true,
      supervised: r.rows[0] as SupervisedListDisplay
    }
  })
