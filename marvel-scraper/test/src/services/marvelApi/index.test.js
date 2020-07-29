'use strict';

const { expect } = require('chai');
const crypto = require('crypto');
const nock = require('nock');
const sinon = require('sinon');
const winston = require('winston');

const config = require('../../../../src/config');
const { MarvelApi } = require('../../../../src/services/marvelApi');

describe('[services/marvelApi]', () => {
  let marvelApi;
  let clock;
  let sandbox;
  let fakeHash;

  before(() => {
    sandbox = sinon.createSandbox();

    const logger = winston.createLogger({
      transports: [new winston.transports.Console(config.logger.options)],
      exitOnError: false,
    });

    const fakeConfig = {
      url: 'http://gateway.marvel.com/v1/public/',
      privateKey: 'PrivateKeyTest',
      publicKey: 'PublicKeyTest',
    };

    marvelApi = new MarvelApi(fakeConfig, logger);

    fakeHash = crypto
      .createHash('md5')
      .update(0 + fakeConfig.privateKey + fakeConfig.publicKey)
      .digest('hex');
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('#getCharacter', () => {
    it('should return data on a 200', async () => {
      const rundeckNock = nock('http://gateway.marvel.com/v1/public/')
        .get('/characters')
        .query({ ts: 0, apikey: 'PublicKeyTest', hash: fakeHash, offset: 0 })
        .matchHeader('Content-Type', 'application/json')
        .reply(200, { res: 'foobar' });

      const res = await marvelApi.getCharacters(0);

      rundeckNock.done();
      expect(res).to.be.deep.equal({ res: 'foobar' });
    });

    it('should throw an error if the API reply an error', async () => {
      const rundeckNock = nock('http://gateway.marvel.com/v1/public/')
        .get('/characters')
        .query({ ts: 0, apikey: 'PublicKeyTest', hash: fakeHash, offset: 0 })
        .matchHeader('Content-Type', 'application/json')
        .replyWithError('Invalid apikey');

      try {
        await marvelApi.getCharacters(0);
      } catch (err) {
        expect(err)
          .to.be.instanceOf(Error)
          .with.property('message', 'Invalid apikey');
      }

      rundeckNock.done();
    });
  });
});
