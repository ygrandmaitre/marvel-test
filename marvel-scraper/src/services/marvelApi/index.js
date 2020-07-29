'use strict';

const crypto = require('crypto');
const superagent = require('superagent');
const url = require('url');

/**
 * Class to get Data from Marvel API
 * Seed documentation here: https://developer.marvel.com/docs
 */
class MarvelApi {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.headers = Object.freeze({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip',
      Connection: 'keep-alive',
    });
  }

  /**
   * This method generate the hash needed to authentication on Marvel API
   *
   * @param {int} ts The timestamp of the request
   * @returns {string} The compute hash
   */
  generateHashAuth(ts) {
    return crypto
      .createHash('md5')
      .update(ts + this.config.privateKey + this.config.publicKey)
      .digest('hex');
  }

  /**
   * Get characters from the Marvel API
   *
   * @param {int} offset Skip the specified number of resources in the result se
   * @returns {Promise<string>} The result of the http request
   */
  async getCharacters(offset) {
    try {
      const ts = Date.now();
      const urlRunJob = new url.URL('characters', this.config.url);
      const { body } = await superagent
        .get(urlRunJob)
        .set(this.headers)
        .query({
          ts: ts.toString(),
          apikey: this.config.publicKey,
          hash: this.generateHashAuth(ts),
          offset,
        });

      this.logger.info({ body });

      return body;
    } catch (err) {
      this.logger.info(
        {
          err,
        },
        '[services/marvelApi#getCharacters] Unexpected marvelApi error',
      );

      throw err;
    }
  }
}

module.exports = {
  MarvelApi,
};
