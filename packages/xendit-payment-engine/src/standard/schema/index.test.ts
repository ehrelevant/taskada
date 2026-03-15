import { describe, expect, it } from '@jest/globals';

import { ErrorResponseSchema, JSONField, MetadataSchema, PhoneNumberSchema } from './index';

describe('standard schema index exports', () => {
  describe('PhoneNumberSchema', () => {
    it('accepts valid phone numbers and null', () => {
      expect(PhoneNumberSchema.safeParse('+1234567890').success).toBe(true);
      expect(PhoneNumberSchema.safeParse('0123456789').success).toBe(true);
      expect(PhoneNumberSchema.safeParse('1234567').success).toBe(true);
      expect(PhoneNumberSchema.safeParse(null).success).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(PhoneNumberSchema.safeParse('abc').success).toBe(false);
      expect(PhoneNumberSchema.safeParse('').success).toBe(false);
    });
  });

  describe('MetadataSchema', () => {
    it('accepts null and small objects', () => {
      expect(MetadataSchema.safeParse(null).success).toBe(true);
      const ok = { key1: 'v1', another: 'x'.repeat(10) };
      expect(MetadataSchema.safeParse(ok).success).toBe(true);
    });

    it('rejects when too many keys or long keys/values', () => {
      const many: Record<string, string> = {};
      for (let i = 0; i < 51; i++) many[`k${i}`] = 'v';
      expect(MetadataSchema.safeParse(many).success).toBe(false);

      const longKey = { ['k'.repeat(41)]: 'v' };
      expect(MetadataSchema.safeParse(longKey).success).toBe(false);

      const longVal = { ok: 'x'.repeat(501) };
      expect(MetadataSchema.safeParse(longVal).success).toBe(false);
    });
  });

  describe('ErrorResponseSchema', () => {
    it('parses valid error responses', () => {
      const obj = { error_code: 'E', message: 'm', errors: ['e', { k: 'v' }] };
      expect(ErrorResponseSchema.safeParse(obj).success).toBe(true);
    });

    it('rejects missing fields', () => {
      expect(ErrorResponseSchema.safeParse({}).success).toBe(false);
    });
  });

  describe('JSONField', () => {
    it('accepts JSON-compatible primitives, arrays and objects', () => {
      expect(JSONField.safeParse('s').success).toBe(true);
      expect(JSONField.safeParse(1).success).toBe(true);
      expect(JSONField.safeParse(true).success).toBe(true);
      expect(JSONField.safeParse(null).success).toBe(true);
      expect(JSONField.safeParse([1, 'a', null]).success).toBe(true);
      expect(JSONField.safeParse({ a: 1, b: { c: 'd' } }).success).toBe(true);
    });

    it('rejects non-JSON values like functions or undefined', () => {
      expect(JSONField.safeParse(() => null).success).toBe(false);
      expect(JSONField.safeParse(undefined).success).toBe(false);
    });

    it('accepts arrays and nested objects', () => {
      expect(JSONField.safeParse([1, 'a', null, { x: 'y' }]).success).toBe(true);
      const nested = { a: [1, { b: 'c' }, null], z: { deep: { v: 3 } } };
      expect(JSONField.safeParse(nested).success).toBe(true);
    });

    it('rejects functions, undefined, and BigInt', () => {
      // function
      expect(JSONField.safeParse(() => null).success).toBe(false);

      // undefined
      expect(JSONField.safeParse(undefined).success).toBe(false);

      // BigInt is not a JSON value
      expect(JSONField.safeParse(1n).success).toBe(false);
    });
  });
});
