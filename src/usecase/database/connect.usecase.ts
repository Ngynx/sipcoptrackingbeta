import { DatabaseConnection } from "src/domain/interface/database-connection.interface";

export class ConnectDatabaseUseCase {
    constructor(private database: DatabaseConnection) {}

    async execute(): Promise<void> {
        if(!this.database.isConnected()) {
            await this.database.connect();
        }
    }
}