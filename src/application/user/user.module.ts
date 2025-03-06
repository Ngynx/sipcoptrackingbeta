import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepositoryAdapter } from "@/infrastructure/database/adapters/user.adapter";
import { CreateUserUsecase } from "@/usecase/user/create.usecase";
import { DatabaseModule } from "../database/database.module";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [
        {
            provide: 'UserRepository',
            useClass: UserRepositoryAdapter
        },
        {
            provide: 'CreateUserUsecase',
            useFactory: (userRepository) => {
                const bcryptAdater = new BcryptRepositoryAdapter();
                return new CreateUserUsecase(userRepository, bcryptAdater);
            },
            inject: ['UserRepository'],
        }
    ]
})
export class UserModule {}