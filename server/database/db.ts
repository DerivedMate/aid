import pg = require('pg')

const pool = new pg.Pool({
  connectionString: process.env['DATABASE_URL'],
  ssl: {
    rejectUnauthorized: false
  }
})

export const query = <T>(q: string, params: string[]): Promise<pg.QueryResult<T>> => pool.query(q, params)

export const getPool = () => pool
