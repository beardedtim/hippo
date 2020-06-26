const path = require('path')

const createLog = require('@/log')
const middleware = require('@/middleware')
const { create: createFileCache } = require('@/file-cache')
const env = require('@/env')
const proc = require('@/process')
const errors = require('@/errors/http')

const Server = require('@/server')

const public_dir = path.resolve(__dirname, '..', 'public')


const log = createLog({
  /**
   * The name of the log. This will be attached to every log
   */
  name: 'NAME',
  /**
   * The minimum log level. Can be int or string
   */
  level: env.string('LOG_LEVEL', 'trace'),
  /**
   * Anything given to values will be logged on each request regardless
   * of the input
   */
  values: {
    pid: proc.pid(),
    platform: proc.platform()
  },
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

    if (message.err) {
      message.err = {
        message: message.err.message,
        code: message.err.code,
        status: message.err.status,
        trace: message.err.stack
      }
    }

    return message
  }
})

const fileCache = createFileCache({ log, max_length: 100 })

const server = new Server({ log, files: fileCache, errors })

server
  .use(middleware.request_id())
  .use(middleware.catch_errors())
  .use(middleware.log_errors())
  .use(middleware.log_request())
  .use(middleware.request_time())
  .use(middleware.security_headers())
  .use(middleware.not_found())
  .use(middleware.static_files({ public: public_dir }))
  .start(env.number('PORT'), () => log.info('Server started'))

proc.onUncaughtError((err) => server.stop(() => {
  log.fatal({ err })
  process.exit(1)
}))
