'use strict';

const http = require('http');

const _ = require('lodash');
const { Router: createRouter } = require('express');

const characters = require('./characters');
/**
 * Per route access token
 *
 * @param {Object} config App configuration
 * @return {Promise} the returned value from next handler
 */
function accessToken(config) {
  return (req, res, next) => {
    const token = _.get(req, 'query.token', req.header('x-request-token'));
    if (config.tokens.indexOf(token) === -1) {
      const err = new Error(http.STATUS_CODES[403]);
      err.status = 403;
      return next(err);
    }

    return next();
  };
}

/**
 * API level Router configuration
 *
 * @param {object} config App configuration
 * @param {Object} mongoClient Mongodb connection
 * @param {Object} logger Logger
 *
 * @returns {Object} The configured Router
 */
function register(config, mongoClient, logger) {
  const router = createRouter();

  router.use(accessToken(config));
  router.use('/characters', characters.register(mongoClient, logger));

  return router;
}

module.exports = {
  register,
  accessToken,
};
