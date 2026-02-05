import { User } from "../ValueObject/User";

export interface IAuthService {
    getUserByID(userId: string): Promise<User>;
}