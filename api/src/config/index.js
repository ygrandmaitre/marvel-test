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
  api: {
    port: process.env.PORT || 8080,
    tokens: (process.env.AUTHORIZED_TOKENS || 'dummy').split(','), // List of authorized tokens
  },
};
