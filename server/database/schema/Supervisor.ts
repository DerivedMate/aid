import { query } from '../db'
import { Hashed, UUID, QError } from '../types'

export interface Supervisor {
  supervisor_id: UUID
  email: string
  password: Hashed
  name: string
  lastname: string
}

export interface RegistrationCredentials {
  email: string
  password: string
  name: string
  lastname: string
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
