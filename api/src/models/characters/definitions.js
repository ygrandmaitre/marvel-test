'use strict';

const DATABASE = 'marvel';
const COLLECTION = 'characters';
const COLLECTION_OPTIONS = {};
const VALIDATOR_SCHEMA = {
  required: ['marvelId', 'name', 'urlPicture', 'insertedAt', 'updatedAt'],
  properties: {
    marvelId: {
      bsonType: 'int',
      description: 'The unique ID of the character',
    },
    name: {
      bsonType: 'string',
      description: 'Name of the character',
    },
    urlPicture: {
      bsonType: 'object',
      description: 'Url of the character picture',
      required: ['path', 'extension'],
      properties: {
        path: {
          bsonType: 'string',
          description: 'Path of the picture of the character',
        },
        extension: {
          bsonType: 'string',
          description: 'the image extension',
        },
      },
    },
    insertedAt: {
      bsonType: 'date',
      description: 'The date when the object has been inserted',
    },
    updatedAt: {
      bsonType: 'date',
      description: 'The date of the last update',
    },
  },
};

const VALIDATOR_OPTIONS = {};

const INDEXES = [{ key: { marvelId: 1 }, background: true, unique: true }];

module.exports = {
  DATABASE,
  COLLECTION,
  COLLECTION_OPTIONS,
  VALIDATOR_SCHEMA,
  VALIDATOR_OPTIONS,
  INDEXES,
};
