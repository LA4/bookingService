import { Module } from '@nestjs/common';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { ConfigModule } from '@nestjs/config';
import { PresentationModule } from './presentation/presentation.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [
    InfrastructureModule,
    PresentationModule,
    ConfigModule.forRoot({isGlobal: true}),
    ApplicationModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
 
