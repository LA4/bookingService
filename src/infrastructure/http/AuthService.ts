import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IAuthService } from "src/domain/repositories/IExternalServices";
import { User } from "src/domain/ValueObject/User";

export class AuthService implements IAuthService {

    constructor (private httpClient: HttpService) {}
    
    async getUserByID(userId: string): Promise<User> {
        const response = await firstValueFrom(this.httpClient.get(`http://auth-service/account/${userId}`));
        return this.toDomain(response.data);
    }

    private toDomain(externalData: any): User {
    return {
      id: externalData.uid,
      name: externalData.firstName,
    };
  }

}