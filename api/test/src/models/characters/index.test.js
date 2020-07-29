'use strict';

const { expect } = require('chai');
const mongodb = require('mongodb');
const sinon = require('sinon');

const characters = require('../../../../src/models/characters');

describe('models/characters/', () => {
  let clock;
  let sandbox;
  let collectionStub;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    clock = sinon.useFakeTimers();

    collectionStub = {
      db: sandbox.stub().returnsThis(),
      collection: sandbox.stub().returnsThis(),
      find: sandbox.stub().returns({ toArray: sandbox.stub() }),
    };
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('getCharacters', () => {
    it('call MongoDb with good parameter', async () => {
      await characters.getCharacters(collectionStub, 2, 4);

      expect(collectionStub.find.args).to.be.deep.equal([
        [
          {},
          {
            limit: 4,
            projection: {
              _id: 0,
              name: 1,
              urlPicture: 1,
            },
            skip: 2,
          },
        ],
      ]);
    });
  });
});
