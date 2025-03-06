import { DatabaseConnection } from "src/domain/interface/database-connection.interface";
import mongoose from 'mongoose';

export class MongoAdapter implements DatabaseConnection {
    private connected = false;
    async connect(): Promise<void> {
        try {
            await mongoose.connect('mongodb://localhost:27017/sipcopserver2024');
            this.connected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            throw error;
        }
    }
    async disconnect(): Promise<void> {
        await mongoose.disconnect();
        this.connected = false;
        console.log('Disconnected from MongoDB');
    }
    
    isConnected(): boolean {
        return this.connected;
    }

}