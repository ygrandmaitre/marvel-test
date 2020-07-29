'use strict';

const { expect } = require('chai');
const mongodb = require('mongodb');
const request = require('supertest');
const sinon = require('sinon');
const winston = require('winston');

let config = require('../../src/config');
const processMain = require('../../src/api.js');

describe('#main', () => {
  let logger;
  let sandbox;
  let stubs;

  before(() => {
    config.api.port = 9091;

    logger = winston.createLogger({
      transports: [new winston.transports.Console(config.logger.options)],
      exitOnError: false,
    });
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    stubs = {
      mongodb: {
        connect: sandbox.stub(mongodb, 'connect').resolves({
          close: sandbox.stub(),
        }),
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('start successfully', async () => {
    const app = await processMain.create(config, logger);

    expect(stubs.mongodb.connect.args).to.be.deep.equal([
      [
        'mongodb://localhost:27017/marvel',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      ],
    ]);

    await app.stop();
  });

  it('starts a web server on default port', async () => {
    let api = await processMain.create(config, logger);
    api.app = await api.start(config.api);

    const { body, status } = await request(api.app).get('/heartbeat');

    expect(status).to.equal(200);
    expect(body).to.deep.equal({ state: 'up' });

    await api.stop();
  });

  it('exposes CORS headers', async () => {
    let api = await processMain.create(config, logger);
    api.app = await api.start(config.api);

    const { headers } = await request(api.app).options('/heartbeat');

    expect(headers).to.have.property('access-control-allow-origin', '*');
    expect(headers).to.have.property(
      'access-control-allow-headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Request-Token',
    );
    expect(headers).to.have.property(
      'access-control-allow-methods',
      'GET, POST, PUT, DELETE',
    );

    await api.stop();
  });

  it('returns 404 on not matching route', async () => {
    let api = await processMain.create(config, logger);
    api.app = await api.start(config.api);
    const { status } = await request(api.app).get('/not-found');

    expect(status).to.equal(404);

    await api.stop();
  });
});
