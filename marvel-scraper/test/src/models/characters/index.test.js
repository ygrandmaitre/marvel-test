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
      updateOne: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  describe('updateOne', () => {
    it('call MongoDb with good parameter', async () => {
      await characters.upsertOne(collectionStub, {
        marvelId: '42',
        name: 'foobar',
      });

      expect(collectionStub.updateOne.args).to.be.deep.equal([
        [
          {
            marvelId: '42',
          },
          {
            $set: {
              marvelId: '42',
              name: 'foobar',
              updatedAt: new Date('1970-01-01T00:00:00.000Z'),
            },
            $setOnInsert: {
              insertedAt: new Date('1970-01-01T00:00:00.000Z'),
            },
          },
          {
            upsert: true,
          },
        ],
      ]);
    });
  });
});
