import { UUID } from '../../../shared/query/columnTypes'
import { query } from '../db'

export const createTake = (medicine_id: UUID): Promise<boolean> =>
  query(
    `
    insert into take 
      ( medicine_id
      , date
      )
    values
      ( $1
      , to_timestamp(${Date.now()} / 1000.0)
      );
    `,
    [medicine_id]
  ).then(r => r.rowCount === 1)
