'use strict';

const mongodb = require('mongodb');
const winston = require('winston');

const charactersDefinitions = require('./models/characters/definitions');
const config = require('./config');
const scrapping = require('./lib/scrapping');
const createServiceProvider = require('./services/index');

async function start(logger) {
  logger.info('Starting application');
  logger.info('Connecting to MongoDB');
  const mongoClient = await mongodb.connect(
    config.mongodb.url,
    config.mongodb.options,
  );
  logger.info('MongoDB connected');

  logger.info('MongoDB beginning init collection');
  const db = mongoClient.db(charactersDefinitions.DATABASE);
  await db
    .collection(charactersDefinitions.COLLECTION)
    .createIndexes(charactersDefinitions.INDEXES);
  await db.command({
    collMod: charactersDefinitions.COLLECTION,
    validator: { $jsonSchema: charactersDefinitions.VALIDATOR_SCHEMA },
  });
  logger.info('MongoDB init collection finished');

  logger.info('Beginning Scrapping');
  const services = createServiceProvider(config, logger);
  await scrapping.scrap(config, { logger, mongoClient, ...services });
  logger.info('Scrapping finished');

  logger.info('MongoDB disconnecting');
  await mongoClient.close();
  logger.info('MongoDB disconnected');
}

/* istanbul ignore next */
if (!module.parent) {
  // Init Logger
  const logger = winston.createLogger({
    transports: [new winston.transports.Console(config.logger.options)],
    exitOnError: false, // do not exit on handled exceptions
  });

  start(logger).catch(err => {
    logger.error(`${err}\n`);
    process.exit(1);
  });
}

module.exports = {
  start,
};
