import { Module } from '@nestjs/common';

// Controllers
import { BookingController } from 'src/presentation/controllers/BookingController';
import { TicketController } from 'src/presentation/controllers/TicketController';

// Services externes
import { ApplicationModule } from 'src/application/application.module';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ApplicationModule, InfrastructureModule, HttpModule],
  controllers: [BookingController, TicketController],
  providers: [AuthGuard],
  exports: [],
})
export class PresentationModule {}
