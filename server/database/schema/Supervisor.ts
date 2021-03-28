import { query } from '../db'
import { QError } from '../types'
import { UUID } from '../../../shared/query/columnTypes'
import {
  RegistrationCredentials,
  RetrievalCredentials,
  Supervisor,
  SupervisorNoPass
} from '../../../shared/query/supervisor'

export const registerSupervisor = ({
  email,
  password,
  name,
  lastname
}: RegistrationCredentials): Promise<[boolean, UUID]> => {
  /**
   * @TODO Add input validation and serialization
   */

  return query<Supervisor>(
    `
    INSERT INTO supervisor 
      (email, password, name, lastname)
    VALUES
      ( $1
      , crypt($2, gen_salt('bf'))
      , $3
      , $4
      )
    RETURNING supervisor_id;
    `,
    [email, password, name, lastname]
  ).then(res => {
    console.dir(res)
    if (res.rowCount === 1) return [true, res.rows[0]['supervisor_id']]
    else throw new Error(QError.NoInsert)
  })
}

export const retrieveSupervisor = ({ email, password }: RetrievalCredentials): Promise<SupervisorNoPass> => {
  console.log(email, password)
  return query(
    `
    select 
      supervisor_id, email, name, lastname 
    from supervisor
    where 
      email = $1
      and password = crypt($2, password);
  `,
    [email, password]
  ).then(r => {
    console.dir(r.rows)
    if (r.rows.length === 1) return r.rows[0] as SupervisorNoPass
    else throw new Error(QError.EntryNotFound)
  })
}

export const getSupervisorSessionData = (id: UUID): Promise<SupervisorNoPass> =>
  query(
    `
    select 
      supervisor_id, email, name, lastname 
    from supervisor
    where 
      supervisor_id = $1;
  `,
    [id]
  ).then(r => {
    if (r.rows.length === 0) throw new Error(QError.EntryNotFound)
    else return r.rows[0] as SupervisorNoPass
  })
