import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserRepositoryAdapter } from "@/infrastructure/database/adapters/user.adapter";
import { CreateUserUsecase } from "@/usecase/user/create.usecase";
import { DatabaseModule } from "../database/database.module";
import { BcryptRepositoryAdapter } from "@/infrastructure/crypto/bcrypt.adapter";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "path";
import { GpsGrpcClientService } from "./client.grpc.service";

@Module({
    imports: [
        DatabaseModule,
        ClientsModule.register([
            {
                name: 'GRPC_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'sipcop',
                    protoPath: join(__dirname, './../../proto/sipcop.proto'),
                    url: 'localhost:50051'
                }
            }
        ])
    ],
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
        },
        GpsGrpcClientService
    ],
    exports: [GpsGrpcClientService]
})
export class UserModule {}