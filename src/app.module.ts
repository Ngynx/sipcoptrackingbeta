import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from './application/database/database.module';
import { ConnectDatabaseUseCase } from './usecase/database/connect.usecase';
import { UserModule } from './application/user/user.module';
import { PuppeteerModule } from './application/puppeteer/puppeteer.module';

@Module({
  imports: [DatabaseModule, UserModule, PuppeteerModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject("ConnectDatabaseUseCase")
    private readonly connectDatabaseUseCase: ConnectDatabaseUseCase
  ) {}
  async onModuleInit() {
    try {
      await this.connectDatabaseUseCase.execute();
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      process.exit(1);
    }
  }
}
