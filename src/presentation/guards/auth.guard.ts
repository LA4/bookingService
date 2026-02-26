import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { AUTH_SERVICE } from 'src/domain/repositories/tokens';
import { IAuthService } from 'src/domain/repositories/IExternalServices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const { userId, isValid } = await this.authService.validateToken(token);

      if (!isValid) {
        throw new UnauthorizedException('Invalid token');
      }

      // On attache simplement l'id au request pour les handlers
      request['user'] = { id: userId };
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
