'use strict';

const express = require('express');
const mongodb = require('mongodb');
const http = require('http');
const winston = require('winston');

const api = require('./api/index');
const config = require('./config');
const { configure } = require('./config/express');

/**
 * Bind process events
 *
 * @returns {void} void
 */
async function bindProcess(fn) {
  process.removeListener('SIGTERM', fn);
  process.removeListener('SIGINT', fn);
  process.removeListener('uncaughtException', fn);
  process.removeListener('unhandledRejection', fn);

  process.once('SIGTERM', fn);
  process.once('SIGINT', fn);
  process.once('uncaughtException', fn);
  process.once('unhandledRejection', fn);
}

/**
 * Create a minimal heartbeat http server process
 *
 * @param {Object} config Configuration object
 * @param {Number} config.port Port of the http server to create
 * @param {Logger} logger Logger
 *
 * @returns {Object} process instance
 */
async function create(config, logger) {
  logger.info('Connecting to MongoDB');
  const mongoClient = await mongodb.connect(
    config.mongodb.url,
    config.mongodb.options,
  );
  logger.info('MongoDB connected');

  let app = null;
  let server = null;

  /**
   * Minimal heartbeat server initialization
   *
   * @returns {Promise<object>} Express application
   */
  async function start(config) {
    if (app) {
      return app;
    }

    logger.info('Express web server creation');
    app = configure(express());
    server = http.createServer(app);

    app.use('/api', api.register(config, mongoClient, logger));

    // After all middlewares definition:
    app.postConfig(logger);

    await server.listen(config.port);

    return app;
  }

  /**
   * Close the HTTP server
   *
   * @returns {Promise<void>} void
   */
  async function stop() {
    await mongoClient.close();
    if (server) {
      await server.close();

      server = null;
      app = null;
    }
  }

  return {
    start,
    stop,
    server,
    app,
  };
}

async function main(logger) {
  const process = await create(config, logger);

  bindProcess(process.stop);
  return await process.start(config.api);
}

/* istanbul ignore next */
if (!module.parent) {
  // Init Logger
  const logger = winston.createLogger({
    transports: [new winston.transports.Console(config.logger.options)],
    exitOnError: false, // do not exit on handled exceptions
  });

  main(logger).catch(err => {
    logger.error(`${err}\n`);
    process.exit(1);
  });
}

module.exports = {
  create,
  main,
};
