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
async function upsertOne(mongoClient, character) {
  const date = new Date();

  await mongoClient
    .db(DATABASE)
    .collection(COLLECTION)
    .updateOne(
      { marvelId: character.marvelId },
      {
        $set: {
          updatedAt: date,
          ...character,
        },
        $setOnInsert: {
          insertedAt: date,
        },
      },
      { upsert: true },
    );
}

module.exports = {
  upsertOne,
};
