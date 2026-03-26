import 'dotenv/config';
import * as schema from '@repo/database';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { UserUpdate } from '@repo/database';

@Injectable()
export class DatabaseService {
  db: NodePgDatabase<typeof schema>;
  schema: typeof schema = schema;

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    });
    this.db = drizzle(pool, { schema, casing: 'snake_case' });
  }

  public async getUser(user_id: string) {
    const [user_row] = await this.db.select().from(schema.user).where(eq(schema.user.id, user_id)).limit(1);
    return user_row;
  }

  public async updateUser(user_id: string, update_values: UserUpdate) {
    const [user_row] = await this.db
      .update(schema.user)
      .set(update_values)
      .where(eq(schema.user.id, user_id))
      .returning();

    return user_row;
  }
}
