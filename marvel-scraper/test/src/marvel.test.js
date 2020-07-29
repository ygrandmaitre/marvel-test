'use strict';

const { expect } = require('chai');
const mongodb = require('mongodb');
const sinon = require('sinon');
const winston = require('winston');

const config = require('../../src/config');
const processMain = require('~/marvel');
const scrapping = require('../../src/lib/scrapping');

describe('#main', () => {
  let sandbox;
  let stubs;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    stubs = {
      mongodb: {
        connect: sandbox.stub(mongodb, 'connect').resolves({
          close: sandbox.stub(),
          db: sandbox.stub().returns({
            collection: sandbox
              .stub()
              .returns({ createIndexes: sandbox.stub() }),
            command: sandbox.stub(),
          }),
        }),
      },
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('start successfully', async () => {
    const logger = winston.createLogger({
      transports: [new winston.transports.Console(config.logger.options)],
      exitOnError: false,
    });

    const scrapStub = sandbox.stub(scrapping, 'scrap');

    await processMain.start(logger);
    expect(scrapStub.calledOnce).to.be.deep.equal(true);
    expect(stubs.mongodb.connect.args).to.be.deep.equal([
      [
        'mongodb://localhost:27017/marvel',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      ],
    ]);
  });
});
