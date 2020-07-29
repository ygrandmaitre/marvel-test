'use strict';

const { DATABASE, COLLECTION } = require('./definitions');

/**
 *
 * Add or update character in the mongo collection
 *
 * @param {mongoClient} mongoClient The MongoDB connection
 * @param {object} character characters data
 * @returns {Promise<void>}
 */
async function getCharacters(mongoClient, offset, limit) {
  const projection = {
    _id: 0,
    name: 1,
    urlPicture: 1,
  };

  return await mongoClient
    .db(DATABASE)
    .collection(COLLECTION)
    .find({}, { projection, limit, skip: offset })
    .toArray();
}

module.exports = {
  getCharacters,
};
