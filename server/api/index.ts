import { Express } from 'express-serve-static-core'
import { instance as signin } from './signin'
import { instance as signup } from './signup'
import { instance as auth } from './auth'

export const init_api = (server: Express) => {
  if (process.env['NODE_ENV'] === 'development')
    server.use((_req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      next()
    })
  ;[signup, signin, auth].forEach(endpoint => endpoint.mount(server, '/api'))
}
