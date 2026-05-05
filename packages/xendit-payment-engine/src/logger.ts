import fs from 'node:fs';

import pino from 'pino';
import { join, resolve } from 'path';

const LOG_FOLDER = resolve(join('.', 'logs', 'xendit-payment-engine'));
fs.mkdirSync(LOG_FOLDER, { recursive: true });
const LOG_PATH = join(LOG_FOLDER, 'package');

export interface Logger {
  info: {
    (obj: object, msg?: string): void;
    (msg?: string): void;
  };
  trace: {
    (obj: object, msg?: string): void;
    (msg?: string): void;
  };
  warn: {
    (obj: object, msg?: string): void;
    (msg?: string): void;
  };
  error: {
    (obj: object, msg?: string): void;
    (msg?: string): void;
  };
  debug: {
    (obj: object, msg?: string): void;
    (msg?: string): void;
  };
}

let injectedLogger: Logger | null = null;

const defaultLogger = pino(
  {
    name: 'Taskada/Xendit Payment Engine',
    level: process.env.LOG_LEVEL || 'info',
    redact: {
      paths: ['*.authorization'],
    },
  },
  pino.transport({
    target: 'pino-roll',
    options: {
      file: LOG_PATH,
      mkdir: true,
      extension: '.log',
      frequency: 'daily',
      size: '128M',
      limit: {
        count: 7, // 7 rotated + 1 active = 8 total
      },
      symlink: true,
    },
  }),
);

export function setLogger(logger: Logger): void {
  injectedLogger = logger;
}

export function getLogger(): Logger {
  return injectedLogger ?? defaultLogger;
}

export default getLogger;
