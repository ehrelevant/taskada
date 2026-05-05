import * as fs from 'node:fs';

import * as os from 'os';
import pino from 'pino';
import { join, resolve } from 'path';

const LOG_FOLDER = resolve(join('.', 'logs'));
fs.mkdirSync(LOG_FOLDER, { recursive: true });
const LOG_PATH = join(LOG_FOLDER, 'server');

export function create_logger(name: string, app_label: string) {
  return pino(
    {
      name: name,
      level: process.env.LOG_LEVEL || 'info',
      base: { pid: process.pid, hostname: os.hostname(), app: app_label },
      redact: {
        paths: [
          // Request headers
          'req.headers.authorization',
          'req.headers.cookie',
          'req.headers.set-cookie',
          'req.headers.token',
          'req.headers.access-token',
          'req.headers.id-token',
          'req.headers.api-key',
          'req.headers.x-api-key',
          'req.headers.secret',
          'req.headers.password',
          'req.headers.session',

          // Response headers
          'res.headers.authorization',
          'res.headers.cookie',
          'res.headers.set-cookie',
          'res.headers.token',
          'res.headers.access-token',
          'res.headers.id-token',
          'res.headers.api-key',
          'res.headers.x-api-key',
          'res.headers.secret',
          'res.headers.password',
          'res.headers.session',

          // Generic locations where sensitive keys often appear
          'req.headers.*key',
          'req.headers.*token',
          'res.headers.*key',
          'res.headers.*token',
        ],
        censor: '<REDACTED>',
      },
    },
    pino.transport({
      targets: [
        {
          target: 'pino-pretty', // console (human readable)
          level: 'debug',
          options: { colorize: true },
        },
        {
          target: 'pino-roll',
          options: {
            file: LOG_PATH,
            mkdir: true,
            extension: '.log',
            frequency: 'daily',
            size: '32M',
            limit: {
              count: 7, // 7 rotated + 1 active = 8 total
            },
            symlink: true,
          },
        },
      ],
    }),
  );
}

const defaultLogger = create_logger('Taskada/API Server', 'taskada-api-server');

export default defaultLogger;
