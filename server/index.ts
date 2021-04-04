/// <reference types="./@types/session" />
const path = require('path')
import express = require('express')
import { readFileSync } from 'fs'
const fallback = require('express-history-api-fallback')
const compression = require('compression')
const cors = require('cors')
const bodyParser = require('body-parser')
import https = require('https')
import { init_api } from './api'
import { init_session } from './session'
// import { query } from './database/db'
// import { initSecurity } from './security'
require('dotenv').config()

/**
 * Instance configuration. Needed by express
 */
const serverPort = process.env.PORT || 3001
const distPathToServe = path.resolve(__dirname, '../build')
const staticExpressOption = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['html'],
  index: 'index.html',
  maxAge: '0',
  lastModified: false,
  redirect: true
}

const privateKey = readFileSync(process.env.KEY_PATH, 'utf-8')
const publicKey = readFileSync(process.env.CRT_PATH, 'utf-8')
const credentials = { key: privateKey, cert: publicKey }

/**
 * Init production server
 */
const initServer = () => {
  const app = express()

  app.options('*', cors())
  app.use(
    bodyParser.json({
      type: ['application/json']
    })
  )

  // initSecurity(app)

  app.use(compression())

  app.use(express.static(distPathToServe, staticExpressOption))
  init_session(app, credentials)

  init_api(app)

  app.use(
    fallback('index.html', {
      root: distPathToServe,
      lastModified: staticExpressOption.lastModified,
      maxAge: staticExpressOption.maxAge,
      dotfiles: staticExpressOption.dotfiles
    })
  )

  /**
   * Permit preflight request
   */

  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(serverPort, () => {
    console.log(`listening at ${serverPort}`)
    // query('select * from supervisor;', []).then(console.dir).catch(console.error  )
  })
}

initServer()
