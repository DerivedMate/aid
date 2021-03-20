import pg = require('pg')

const pool = new pg.Pool()

export const query = <T>(q: string, params: string[]): Promise<pg.QueryResult<T>> => pool.query(q, params)
