import { Injectable } from '@nestjs/common';
import { IAuthService } from 'src/domain/repositories/IExternalServices';
import { User } from 'src/domain/ValueObject/User';

/**
 * Mock temporaire du service Auth
 * TODO: Remplacer par une vraie implémentation qui appelle le microservice Auth
 */
@Injectable()
export class MockAuthService implements IAuthService {
  async getUserByID(userId: string): Promise<User | null> {
    // Mock: retourne toujours un utilisateur valide
    // TODO: Faire un vrai appel HTTP au service Auth
    console.warn('⚠️  Using MockAuthService - Replace with real AuthService implementation');
    
    if (!userId) {
      return null;
    }

    return {
      id: userId,
      email: `user-${userId}@example.com`,
      name: `User ${userId}`
    } as User;
  }

  async validateToken(token: string): Promise<{ userId: string; isValid: boolean }> {
    // Mock: valide tous les tokens
    // TODO: Implémenter la vraie validation de token
    console.warn('⚠️  Using MockAuthService - Replace with real AuthService implementation');
    
    return {
      userId: 'mock-user-id',
      isValid: true
    };
  }
}
