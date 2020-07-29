'use strict';

const bodyParser = require('body-parser');

const config = require('../config');

/**
 * Express post registration configuration
 *
 * @param {Express} app Express application instance
 * @return {Express} app
 */
function post(app, logger) {
  /**
   * Note: the following `next` is important because if its not present, the function
   * will not be called at all.
   */
  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    if (typeof err !== 'object') {
      // If the object is not an Error, create a representation that appears to be
      err = {
        // eslint-disable-line no-param-reassign
        status: 500,
        message: String(err), // Coerce to string
      };
    } else {
      // Ensure that err.message is enumerable (It is not by default)
      Object.defineProperty(err, 'message', { enumerable: true });
      Object.defineProperty(err, 'status', {
        enumerable: true,
        value: err.status || 500,
      });
    }

    if (err.status === 500) {
      logger.error('[express#errorHandler] Error', { err });
    }

    /* istanbul ignore next */
    return res.status(err.status).json({
      code: err.status,
      message: err.message,
    });
  });

  return app;
}

/**
 * Configure the Express app with default configuration
 *
 * @param {Express} app Express application
 * @returns {Object} Configured Express application
 */
function configure(app) {
  /**
   * Heartbeat activation
   */
  app.get('/heartbeat', (req, res) =>
    res.status(200).json({
      state: 'up',
    }),
  );

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Request-Token',
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    if (req.method === 'OPTIONS') {
      return res.send();
    }

    return next();
  });

  app.set('port', config.port);

  app.postConfig = logger => post(app, logger);

  return app;
}

module.exports = {
  configure,
};
