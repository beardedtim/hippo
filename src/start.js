const createLog = require('@/log')
const path = require('path')

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
  transports: [
    /**
     * The File Transport appends the logs to `/<path>/<method>.log` file
     */
    createLog.transports.file(path.resolve(__dirname, '..', 'logs')),
    /**
     * The Console Transport logs to stdout
     */
    createLog.transports.console
  ],
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

    return message
  }
})
