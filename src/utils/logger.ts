import winston, { format, transports } from 'winston';
import util from 'util';

const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp, service, ...meta }) => {
  for (const sym of Object.getOwnPropertySymbols(meta)) {
    delete meta[sym];
  }

  const metaString = Object.keys(meta).length
    ? `\n${util.inspect(meta, { colors: true, depth: null })}`
    : '';
  return `[${timestamp}] [${
    service || 'app'
  }] ${level}: ${message} ${metaString}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    myFormat
  ),
  defaultMeta: { service: 'main-service' },
  transports: [new transports.Console()],
});
