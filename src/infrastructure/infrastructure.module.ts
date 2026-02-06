import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma/PrismaService';
import { PrismaBookingRepository } from './database/repository/PrismaBookingRepository';
import { PrismaTicketRepository } from './database/repository/PrismaTicketRepository';
import { MockAuthService } from './adapters/external/MockAuthService';
import { BOOKING_REPOSITORY, TICKET_REPOSITORY, AUTH_SERVICE } from 'src/domain/repositories/tokens';

@Module({
    providers: [
        PrismaService,
        {
            provide: BOOKING_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaBookingRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: TICKET_REPOSITORY,
            useFactory: (prisma: PrismaService) => new PrismaTicketRepository(prisma),
            inject: [PrismaService],
        },
        {
            provide: AUTH_SERVICE,
            useClass: MockAuthService,
        },
    ],
    exports: [BOOKING_REPOSITORY, TICKET_REPOSITORY, AUTH_SERVICE, PrismaService],
})
export class InfrastructureModule { }
