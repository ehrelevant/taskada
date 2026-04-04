import pino from 'pino';
import { join, resolve } from 'path';
import type { KyResponseWithRequest } from '@src/types';

type WithKy = { kyResponse?: KyResponseWithRequest };

const LOG_PATH = resolve(join('.', 'logs', 'log'));

function hasKyResponse(o: unknown): o is WithKy {
  return (
    typeof o === 'object' && o !== null && 'kyResponse' in o && (o as Record<string, unknown>).kyResponse !== undefined
  );
}

const logger = pino(
  {
    name: 'Taskada/Xendit Payment Engine',
    level: process.env.LOG_LEVEL || 'info',
    mixin: (mergeObject: object, _log_level_number: number, _logger: pino.Logger): object => {
      if (!hasKyResponse(mergeObject)) {
        return {};
      }
      const resp = mergeObject.kyResponse;
      if (resp === undefined) {
        return {};
      }

      const returnObject = {
        response: JSON.stringify(resp),
      };
      if (resp.request === undefined) {
        return returnObject;
      }
      return {
        ...returnObject,
        request: JSON.stringify(resp.request),
      };
    },
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
      symlink: true,
      limit: {
        count: 7, // 7 rotated + 1 active = 8 total
      },
    },
  }),
);

logger.info(`Log output will be stored in ${LOG_PATH}`);

export default logger;
