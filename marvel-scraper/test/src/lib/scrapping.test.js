'use strict';

'use strict';

const { expect } = require('chai');
const mongodb = require('mongodb');
const sinon = require('sinon');
const winston = require('winston');

const characters = require('../../../src/models/characters');
const config = require('../../../src/config');
const scrapping = require('../../../src/lib/scrapping');

describe('lib/scrapping', () => {
  let sandbox;
  let logger;
  let stubs;

  before(() => {
    sandbox = sinon.createSandbox();

    logger = winston.createLogger({
      transports: [new winston.transports.Console(config.logger.options)],
      exitOnError: false,
    });
  });

  beforeEach(() => {
    stubs = {
      characters: {
        upsertOne: sandbox.stub(characters, 'upsertOne'),
      },
      mongoClient: sandbox.stub(),
      marvelApi: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#scrab', () => {
    it('scrap insert data in database with one api call', async () => {
      stubs.marvelApi.getCharacters = () => {
        return {
          data: {
            results: [
              {
                id: '42',
                name: 'superHero',
                thumbnail: { path: 'fakePath', extension: 'jpg' },
              },
              {
                id: '43',
                name: 'superHero2',
                thumbnail: { path: 'fakePath', extension: 'jpg' },
              },
            ],
          },
        };
      };
      await scrapping.scrap(
        {},
        { logger, mongoClient: stubs.mongoClient, marvelApi: stubs.marvelApi },
      );

      expect(stubs.characters.upsertOne.args).to.be.deep.equal([
        [
          stubs.mongoClient,
          {
            marvelId: '42',
            name: 'superHero',
            urlPicture: { path: 'fakePath', extension: 'jpg' },
          },
        ],
        [
          stubs.mongoClient,
          {
            marvelId: '43',
            name: 'superHero2',
            urlPicture: { path: 'fakePath', extension: 'jpg' },
          },
        ],
      ]);
    });

    it('scrap insert data in database with two api call', async () => {
      stubs.marvelApi.getCharacters = sinon.stub();
      stubs.marvelApi.getCharacters
        .onFirstCall()
        .resolves({
          data: {
            offset: 0,
            count: 1,
            total: 2,

            results: [
              {
                id: '42',
                name: 'superHero',
                thumbnail: { path: 'fakePath', extension: 'jpg' },
              },
            ],
          },
        })
        .onSecondCall()
        .resolves({
          data: {
            offset: 1,
            count: 1,
            total: 2,

            results: [
              {
                id: '43',
                name: 'superHero2',
                thumbnail: { path: 'fakePath', extension: 'jpg' },
              },
            ],
          },
        });

      await scrapping.scrap(
        {},
        { logger, mongoClient: stubs.mongoClient, marvelApi: stubs.marvelApi },
      );

      expect(stubs.characters.upsertOne.args).to.be.deep.equal([
        [
          stubs.mongoClient,
          {
            marvelId: '42',
            name: 'superHero',
            urlPicture: { path: 'fakePath', extension: 'jpg' },
          },
        ],
        [
          stubs.mongoClient,
          {
            marvelId: '43',
            name: 'superHero2',
            urlPicture: { path: 'fakePath', extension: 'jpg' },
          },
        ],
      ]);
    });
  });
});
