'use strict';

const _ = require('lodash');
const { Router: createRouter } = require('express');

const characters = require('../models/characters');

/**
 * Returning Marvel Characters
 * @param {ExpressRequest} req Express request object
 * @param {ExpressRequest} res Express response object
 * @param {cb} next Express Callback
 *
 * @return {undefined}
 */
const getCharacters = (mongodb, logger) => async (req, res, next) => {
  try {
    logger.info('[/api/characters/] Returning the Marvel characters');

    const offset = _.get(req, 'query.offset', 0);
    const limit = _.get(req, 'query.limit', 20);
    const size_picture = _.get(req, 'query.size_picture', 'xlarge');

    const resCall = await characters.getCharacters(
      mongodb,
      parseInt(offset, 10),
      parseInt(limit, 10),
    );

    const superHereos = resCall.map(e => {
      return {
        name: e.name,
        picture: `${e.urlPicture.path}/standard_${size_picture}.${e.urlPicture.extension}`,
      };
    });

    res.json(superHereos);
  } catch (err) {
    logger.error('[/api/characters] Error while getting characters', { err });

    next(err);
  }
};

/**
 * Controllers registration function
 *
 *
 * @returns {Object} The configured Router
 */
function register(mongoClient, logger) {
  const router = createRouter();

  router.get('/', getCharacters(mongoClient, logger));

  return router;
}

module.exports = {
  register,
};
