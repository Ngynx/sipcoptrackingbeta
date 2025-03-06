import { UserEntity } from "@/domain/entity/user.entity";
import { UserRepository } from "@/domain/interface/user-repository.interface";
import { UserModel } from "../models/user.model";

export class UserRepositoryAdapter implements UserRepository {
    constructor() {};

    async createUser(user: UserEntity): Promise<UserEntity> {
        const newUser = await UserModel.create(user);
        return new UserEntity(
            newUser.user_name,
            newUser.user_lastname,
            newUser.user_username,
            newUser.user_document_number,
            newUser.user_cellphone_number,
            newUser.user_email,
            newUser.user_password,
            newUser.user_address,
            newUser.user_is_root,
            newUser.user_is_admin
        );
    };

    async getUserById(id: string): Promise<UserEntity> {
        const user = await UserModel.findById(id);
        if(!user) return null;
        return new UserEntity(
            // user._id,
            user.user_name,
            user.user_lastname,
            user.user_username,
            user.user_document_number,
            user.user_cellphone_number,
            user.user_email,
            user.user_password,
            user.user_address,
            user.user_is_root,
            user.user_is_admin
        )
    }
    
    async getUserByEmail(email: string): Promise<UserEntity> {
        throw new Error("Method not implemented.");
    }
    
    async updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
        const updatedUser = await UserModel.findByIdAndUpdate(id, user, {new: true});
        if(!updatedUser) return null;
        return new UserEntity(updatedUser.user_name, updatedUser.user_lastname, updatedUser.user_username, updatedUser.user_document_number, updatedUser.user_cellphone_number, updatedUser.user_email, updatedUser.user_password, updatedUser.user_address, updatedUser.user_is_root, updatedUser.user_is_admin);
    }
    
    async deleteUser(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    async getUsers(): Promise<UserEntity[]> {
        throw new Error("Method not implemented.");
    }

}