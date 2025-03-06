import { Global, Module } from "@nestjs/common";
import { MongoAdapter } from "src/infrastructure/database/adapters/mongo.adapter";
import { ConnectDatabaseUseCase } from "src/usecase/database/connect.usecase";
import { DisconnectDatabaseUseCase } from "src/usecase/database/disconnect.usecase";

@Global()
@Module({
    providers: [
      {
        provide: 'DatabaseConnection',
        useClass: MongoAdapter, 
      },
      {
        provide: 'ConnectDatabaseUseCase',
        useFactory: (dbConnection) => new ConnectDatabaseUseCase(dbConnection),
        inject: ['DatabaseConnection'],
      },
      {
        provide: 'DisconnectDatabaseUseCase',
        useFactory: (dbConnection) => new DisconnectDatabaseUseCase(dbConnection),
        inject: ['DatabaseConnection'],
      },
    ],
    exports: ['ConnectDatabaseUseCase', 'DisconnectDatabaseUseCase'],
  })
export class DatabaseModule {}