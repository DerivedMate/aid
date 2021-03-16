import { Express } from 'express-serve-static-core'
const helmet = require('helmet')
const hpp = require('hpp')
const cors = require('cors')

const corsOptions = {
  origin: process.env.HTTPS === 'true' ? `https://${process.env.DOMAIN_NAME}` : `http://${process.env.DOMAIN_NAME}`,
  optionsSuccessStatus: 200
}

export const initSecurity = (server: Express) => {
  /** Set HTTP parameter pollution */
  server.use(hpp())

  /** Set cors */
  server.use(cors(corsOptions))

  /** Set X-Download-Options header */
  server.use(helmet.ieNoOpen())

  /** Set X-Content-Type-Options header */
  server.use(helmet.noSniff())

  /** Remove X-Powered-By header */
  server.use(helmet.hidePoweredBy())

  /** Set X-XSS-Protection header */
  server.use(helmet.xssFilter())

  /** Set Referrer-Policy header */
  server.use(helmet.referrerPolicy({ policy: 'same-origin' }))

  /** Set Expect-CT header */
  server.use(
    helmet.expectCt({
      reportUri: process.env.CT_REPORT_URI,
      maxAge: 86400,
      enforce: true
    })
  )

  /** Set Content-Security-Policy header */
  server.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https:', process.env.DOMAIN_NAME],
        fontSrc: ["'self'", 'data:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", 'https:', 'wss:', process.env.API_URL],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        frameAncestors: ["'none'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        reportUri: [
          /* process.env.CSP_REPORT_URI */
        ],
        reportTo: [
          /* process.env.CSP_REPORT_URI */
        ],
        upgradeInsecureRequests: '',
        blockAllMixedContent: ''
      }
    })
  )

  /** Set X-DNS-Prefetch-Control header */
  server.use(
    helmet.dnsPrefetchControl({
      allow: true
    })
  )

  /** Set X-Frame-Options header */
  server.use(
    helmet.frameguard({
      action: 'deny'
    })
  )

  /** Set X-Permitted-Cross-Domain-Policies header */
  server.use(
    helmet.permittedCrossDomainPolicies({
      permittedPolicies: 'none'
    })
  )

  /** Set Strict-Transport-Security header */
  server.use(
    helmet.hsts({
      maxAge: 15552000,
      includeSubDomains: true,
      preload: true
    })
  )

  /** Set Permissions-Policy header */
  server.use((_req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=(), fullscreen=(self)')
    next()
  })

  /** Set Report-To header (Report ) */
  server.use((_req, res, next) => {
    res.setHeader(
      'Report-To',
      JSON.stringify({
        group: 'default',
        max_age: 31536000,
        endpoints: [{ url: process.env.API_REPORT_URI }],
        include_subdomains: true
      })
    )
    next()
  })
}
