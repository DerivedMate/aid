import { Express } from 'express-serve-static-core'
// import { instance as signin } from './signin'
import { instance as signup } from './signup'
export const init_api = (server: Express) => {
  ;[signup].forEach(endpoint => endpoint.mount(server, '/api'))
}
