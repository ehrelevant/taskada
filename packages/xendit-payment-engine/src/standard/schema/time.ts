import * as z from 'zod';

export const DatetimeSchema = z.iso.datetime().meta({
  example: '2021-12-31T23:59:59Z',
});
