import { and, eq } from 'drizzle-orm';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { userRole } from '@repo/database';

import { DatabaseService } from '../database/database.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly dbService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId: string | undefined = request.session?.user?.id;

    if (!userId) {
      throw new ForbiddenException('Not authenticated');
    }

    const [role] = await this.dbService.db
      .select({ role: userRole.role })
      .from(userRole)
      .where(and(eq(userRole.userId, userId), eq(userRole.role, 'admin')))
      .limit(1);

    if (!role) {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}
