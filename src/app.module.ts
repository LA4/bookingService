import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [InfrastructureModule, DomainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
