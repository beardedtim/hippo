const path = require('path')

const createLog = require('@/log')
const Server = require('@/server')
const middleware = require('@/middleware')
const httpErrors = require('@/errors/http')

const log = createLog({
  /**
   * The name of the log. This will be attached to every log
   */
  name: 'NAME',
  /**
   * The minimum log level. Can be int or string
   */
  level: 10,
  /**
   * Anything given to values will be logged on each request regardless
   * of the input
   */
  values: {},
  /**
   * If the output should be colorized or not
   */
  colorized: true,
  /**
   * Where we send the logs. If this value is undefined, it will
   * fallback to transports.console
   */
  // transports: [
  //   /**
  //    * The File Transport appends the logs to `/<path>/<method>.log` file
  //    */
  //   createLog.transports.file(path.resolve(__dirname, '..', 'logs')),
  //   /**
  //    * The Console Transport logs to stdout
  //    */
  //   createLog.transports.console
  // ],
  /**
   * Each time we create a message to log, we get a chance to serialize the
   * object. In this way, if someone gives us an Express `request` object, we
   * can only grab the values that we want off the request and not get
   * Circular Reference errors when trying to stringify for logging
   */
  serializer: (message) => {
    if (message.res) {
      message.res = {
        status: message.res.status
      }
    }

    if (message.req) {
      message.req = {
        url: message.req.url,
        method: message.req.method,
        headers: message.req.headers
      }
    }

    return message
  }
})

const server = new Server({ log })

process.on('uncaughtException', err => {
  server.stop(() => {
    log.fatal({ err }, 'UNCAUGHT EXCEPTION')
    process.exit(1)
  })
})

process.on('unhandledRejection', err => {
  server.stop(() => {
    log.fatal({ err }, 'UNHANDLED REJECTION')
    process.exit(1)
  })
})

server
  .start(5001, () => log.info('Server started'))
  .use(middleware.request_id())
  .use(middleware.catch_errors())
  .use(middleware.log_errors())
  .use(middleware.log_request())
  .use(async (ctx, next) => {
    throw new httpErrors.TeaPot()
  })