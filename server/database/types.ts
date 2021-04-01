export enum QError {
  NoInsert = 'INSERT has failed; 0 rows affected',
  EntryNotFound = 'Found no matching'
}

const uuidValidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const validateUUID = (inp: string): boolean => uuidValidRegex.test(inp)
