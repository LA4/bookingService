import { User } from '../ValueObject/User';

export interface IAuthService {
  getUserByID(userId: string): Promise<User>;
  validateToken(token: string): Promise<{ userId: string; isValid: boolean }>;
}
