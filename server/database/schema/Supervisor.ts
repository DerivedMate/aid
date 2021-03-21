import { query } from '../db'
import { Hashed, UUID, QError } from '../types'

export interface Supervisor {
  supervisor_id: UUID
  email: string
  password: Hashed
  name: string
  lastname: string
}

export interface SupervisorNoPass {
  supervisor_id: UUID
  email: string
  name: string
  lastname: string
}

export interface RegistrationCredentials {
  email: string
  password: string
  name: string
  lastname: string
}

export interface RetrievalCredentials {
  email: string
  password: string
}

export const registerSupervisor = ({ email, password, name, lastname }: RegistrationCredentials): Promise<Boolean> => {
  /**
   * @TODO Add input validation and serialization
   */

  return query(
    `
    INSERT INTO supervisor 
      (email, password, name, lastname)
    VALUES
      ( $1
      , crypt($2, gen_salt('bf'))
      , $3
      , $4
      );
    `,
    [email, password, name, lastname]
  ).then(res => {
    if (res.rowCount === 1) return true
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
  )
    .then(r => {
      console.dir(r.rows)
      if (r.rows.length === 1) return r.rows[0] as SupervisorNoPass
      else throw new Error(QError.EntryNotFound)
    })
    .catch(e => {
      console.error(e)
      return e
    })
}
