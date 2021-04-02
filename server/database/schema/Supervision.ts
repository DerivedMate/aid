import { UUID } from '../../../shared/query/columnTypes'
import { query } from '../db'

export const AuthSupervision = (supervised_id: UUID, supervisor_id: UUID): Promise<boolean> =>
  query(
    `
    select supervision_id 
    from supervision
    where 
      supervised_id = $1 and
      supervisor_id = $2;
    `,
    [supervised_id, supervisor_id]
  ).then(r => r.rows.length > 0)
