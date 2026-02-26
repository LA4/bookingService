import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IAuthService } from 'src/domain/repositories/IExternalServices';
import { User } from 'src/domain/ValueObject/User';

@Injectable()
export class RealAuthService implements IAuthService {
  private readonly logger = new Logger(RealAuthService.name);
  private authUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

  async getUserByID(userId: string): Promise<User> {
    try {
      this.logger.log(`Fetching user info for ID: ${userId} from Auth service`);

      const { data } = await firstValueFrom(
        this.httpService.get<any>(`${this.authUrl}api/account/${userId}`),
      );

      this.logger.debug(
        `Received data from Auth service: ${JSON.stringify(data)}`,
      );

      return {
        id: data.id || data.uid || data._id || userId,
        name: data.name || data.firstName || data.username || `User ${userId}`,
      } as User;
    } catch (error) {
      this.logger.error(
        `Error fetching user from Auth service: ${error.message}`,
      );
      throw new Error(`Auth service unavailable or user not found: ${userId}`);
    }
  }

  async validateToken(
    token: string,
  ): Promise<{ userId: string; isValid: boolean }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{
          id?: string;
          uid?: string;
          _id?: string;
          sub?: string;
        }>(
          `${this.authUrl}api/valid-token`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );
      return {
        userId: data.id || data.uid || data._id || data.sub || '',
        isValid: true,
      };
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      return {
        userId: '',
        isValid: false,
      };
    }
  }
}
