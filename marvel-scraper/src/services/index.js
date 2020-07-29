'use strict';

const { MarvelApi } = require('./marvelApi');

/**
 * Creates the service provider.
 * It is the owner of all the services that can be injected
 * into a process
 *
 * @param {Object} config Configuration of the services
 * @returns {Object} service provider
 */
function createServiceProvider(config, logger) {
  return {
    marvelApi: new MarvelApi(config.marvelApi, logger),
  };
}

module.exports = createServiceProvider;
