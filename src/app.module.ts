import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainModule } from './domain/domain.module';
import { ConfigModule } from '@nestjs/config';
import { BookingModule } from './presentation/BookingModule';

@Module({
  imports: [
    InfrastructureModule,
    DomainModule,
    BookingModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 
