import { Hashed, UUID } from './columnTypes'

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
