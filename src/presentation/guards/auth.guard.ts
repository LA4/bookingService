// auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Request } from 'express';

interface AuthResponse {
  id: string;
  role: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Missing token');

    try {
      const authUrl = this.configService.get('AUTH_SERVICE_URL');

      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponse>(
          `${authUrl}/validate`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      // On attache simplement l'utilisateur à la requête pour les prochains guards/handlers
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}