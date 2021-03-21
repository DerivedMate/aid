export type UUID = string
export type Hashed = string

export enum QError {
  NoInsert = 'INSERT has failed; 0 rows affected',
  EntryNotFound = 'Found no matching'
}
