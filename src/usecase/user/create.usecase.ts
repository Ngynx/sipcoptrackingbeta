import { UserEntity } from "@/domain/entity/user.entity";
import { UserRepository } from "@/domain/interface/user-repository.interface";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";

export class CreateUserUsecase {
    constructor(
        readonly userRepository: UserRepository,
        readonly bcryptAdater: BcryptRepositoryAdapter
    ) {}

    async execute(dto: any): Promise<UserEntity> {
        const hashedPassword = await this.bcryptAdater.hashPassword(dto.user_password);
        const newUser = new UserEntity(
            dto.user_name,
            dto.user_lastname,
            dto.user_username,
            dto.user_document_number,
            dto.user_cellphone_number,
            dto.user_email,
            hashedPassword,
            dto.user_address,
            dto.user_is_root,
            dto.user_is_admin
        );
        return this.userRepository.createUser(newUser);
    }
}