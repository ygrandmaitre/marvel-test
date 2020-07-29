'use strict';

const { format, transports } = require('winston');

/* istanbul ignore next */
module.exports = {
  mongodb: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/marvel',
  },
  logger: {
    options: {
      level: process.env.LOGGER_LEVEL || 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
    },
    transports: [
      new transports.Console({
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
      }),
    ],
  },
  marvelApi: {
    url: process.env.MARVEL_API_URL || 'http://gateway.marvel.com/v1/public/',
    privateKey: process.env.MARVEL_API_PRIVATE_KEY,
    publicKey: process.env.MARVEL_API_PUBLIC_KEY,
  },
};
