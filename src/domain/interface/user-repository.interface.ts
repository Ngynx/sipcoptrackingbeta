import { UserEntity } from "@/domain/entity/user.entity";

export class UserRepository {
    createUser(user: UserEntity): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    getUserById(id: string): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    getUserByEmail(email: string): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    updateUser(id:string, user: UserEntity): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    deleteUser(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getUsers(): Promise<UserEntity[]> {
        throw new Error('Method not implemented.');
    }
}