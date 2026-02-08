import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { parse } from 'cookie';
import { Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();

    try {
      // Parse cookies from handshake headers
      const cookies = client.handshake.headers.cookie;

      if (!cookies) {
        client.emit('error', { message: 'No cookies found' });
        return false;
      }

      const parsedCookies = parse(cookies);

      // Check for Better Auth session cookie
      const sessionCookie = parsedCookies['better-auth.session_token'];

      if (!sessionCookie) {
        client.emit('error', { message: 'No session found' });
        return false;
      }

      // For now, we'll extract user info from the socket handshake auth
      // TODO: validate the session token against auth database
      const auth = client.handshake.auth;

      if (auth.userId && auth.userRole) {
        client.userId = auth.userId;
        client.userRole = auth.userRole;
        return true;
      }

      // If auth is not in handshake, we'll allow the connection but require it for protected events
      // TODO: This is a simplified approach; validate the session token properly
      return true;
    } catch {
      client.emit('error', { message: 'Authentication failed' });
      return false;
    }
  }
}
