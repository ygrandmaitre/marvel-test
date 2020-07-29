'use strict';

const { MarvelApi } = require('../services/marvelApi');
const characters = require('../models/characters/');

async function scrap(config, services) {
  const { logger, marvelApi, mongoClient } = services;

  let offset = 0;
  let res = await marvelApi.getCharacters(offset);

  // Insert character in database
  // @todo May be we can improve performance by using bulk insert
  res.data.results.map(
    async character =>
      await characters.upsertOne(mongoClient, {
        marvelId: character.id,
        name: character.name,
        urlPicture: {
          path: character.thumbnail.path,
          extension: character.thumbnail.extension,
        },
      }),
  );

  while (res.data.total > res.data.offset + res.data.count) {
    offset += res.data.count;

    logger.info({ offset });
    res = await marvelApi.getCharacters(offset);

    // Insert character in database
    // @todo May be we can improve performance by using bulk insert
    res.data.results.map(character =>
      characters.upsertOne(mongoClient, {
        marvelId: character.id,
        name: character.name,
        urlPicture: {
          path: character.thumbnail.path,
          extension: character.thumbnail.extension,
        },
      }),
    );
  }
}

module.exports = {
  scrap,
};
