import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './database/prisma/PrismaService';
import { PrismaBookingRepository } from './database/repository/PrismaBookingRepository';
import { PrismaTicketRepository } from './database/repository/PrismaTicketRepository';
import { RealAuthService } from './adapters/external/RealAuthService';
import {
  BOOKING_REPOSITORY,
  TICKET_REPOSITORY,
  AUTH_SERVICE,
} from 'src/domain/repositories/tokens';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    PrismaService,
    {
      provide: BOOKING_REPOSITORY,
      useFactory: (prisma: PrismaService) =>
        new PrismaBookingRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TICKET_REPOSITORY,
      useFactory: (prisma: PrismaService) => new PrismaTicketRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: AUTH_SERVICE,
      useClass: RealAuthService,
    },
  ],
  exports: [BOOKING_REPOSITORY, TICKET_REPOSITORY, AUTH_SERVICE, PrismaService],
})
export class InfrastructureModule {}
