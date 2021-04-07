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

const SECRET = `MIIEogIBAAKCAQEAk4yAnIIxKmvMEnqXz+OYGJJXLgeennLN78EJclr61DHciAyP
DsCdWdLLj2jNz7C4NCCLkdvf2p4C/rgzl8Krwl1BBvjdtI4+fGqQbmAbgAm2uwJv
u4NSp07IvxGEjRvdx3ewOeQhPHx4KzdWReB6+9TDyD3ggiF6ehxvobu/Dr2q0xfw
cE0Y7GMSQb/w4UnwkrlDwXfmZLfMwBWU/BDeNe3DK6Z99+BHH4qksmIrjxSQ2TyI
BTv/wntwHp/KU2kpJfpWqQi7tlIfx3QLXyeh/WME5kmts3N8bP9SQjZK38lao4+S
2TNODqceAN30hYP3ClxZkzO124VZEr/YC93t1QIDAQABAoIBADilo6by0P9xXWrm
yCwXPAiK/o98e2hnuSrIGOFfjpczAXD2KWJHjuGybVaErSeEuGPC7vKz0LC1I385
pw0nvxujA9kyaKPuTI0luIe3vDcfA5muqMj79Rqow6efiR1HypDPIchIDn6TZuto
lmXDdlQC7puNLgmn4sbI7g7Q7twwXg2cNurLgv27ZiilxfpQhu1tzMLAuh4kv0M/
Yyt/WOwkzWwrKe99oUtZatEHz1P7HdnczTirHDX+WB0qWOYP2Pxd8fxbNIIERIQx
2ZEOS+VRuCP3+/Llo/FktNZo/fw+bLMxbocfjtxHyyu0vRq4zteGOiFwNCwDJ7pS
zjNxIAECgYEAw57++DYmiOjJG+DGxc/TcSnt7TTknjVbYEOcnkQSf42fgWnv/MX7
bK2u5Qgi1TvakCHzneQPOLCm19EauVDZIq84sOCCo96kwBdNTyeBLpO2EHQGFszw
O9MLFH5XblhLZXANGnZX5SJN93EC+D/s0CpbSMbn1Xli/NyFQxK2pdUCgYEAwRcT
w96D0vB1kcXqPGT64rE9RRq9AkHUPpQ7xSuSBxSqqnZn2EBQy+fYNM80dQDW3Unk
c3CFtCoXRwDpVdN1FS8mMCxnmgMyHWBWyBJU5IlaSFaMJ5fG0AAHKdehkP3WXUo8
8249zrCjRGDUdJH2ALUJYbV4vV7qbwo4AztGKAECgYBj20+wCIRXMu0l6/HLnDEE
/TBU+8EP+ZCxbRIPwBPpRLP9bcRxteaILYivpR2S18DT/mDLYlVazOH+HOGVY23T
xLodoB1P5SEYZUyzcSkCS6iOcYuCLA8dmrd3OJ8M1sl1+GLX9T0c3AwMmYW4j3kl
MdnzJoXFdPdQuIjWGkFeGQKBgHLRACXGWOjDp4WJBGHpQe4uqlo/Lgj7j/OuPWRf
JjQjq+A1DEbg56p4MG4mj/DLEPkBCWFDlZ2uMa0884LffI2ePb0Dio9gOxqQwMmz
bNuAeTjujeS1MblZaukMmbwX1LIghOHTudj/2/W7BlpSuM9u1ydMu4EPwaNJlkkF
pBABAoGAZ8lANaPi9VFDjyWBRBwAYfCOo4A9L1ZP/28gtBAOucijCinVSxucULkQ
Oa3GlymQr3LLqUvhX+iGpHqlm27r+POYFZXE5NTDicSHLE7pyL94obKWUrocfL9Q
KNiVHgeby8iFlwKvSnD3QQPV+PX7VxceCNKRLsF0Vg2VCxrA5Es=`

const isDev = process.env['NODE_ENV'] === 'development'
const credentials = {
  key: isDev ? readFileSync(process.env.KEY_PATH, 'utf-8') : SECRET,
  cert: isDev ? readFileSync(process.env.CRT_PATH, 'utf-8') : ''
}

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
  init_session(app, credentials.key)

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
  if (isDev) {
    const httpsServer = https.createServer(credentials, app)
    httpsServer.listen(serverPort, () => {
      console.log(`listening at ${serverPort}`)
      // query('select * from supervisor;', []).then(console.dir).catch(console.error  )
    })
  } else {
    app.listen(serverPort, () => {
      console.log(`listening at ${serverPort}`)
      // query('select * from supervisor;', []).then(console.dir).catch(console.error  )
    })
  }
}

initServer()
