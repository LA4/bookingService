import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/http/PrismaService';
import { PrismaBookingRepository } from 'src/infrastructure/database/repository/PrismaBookingRepository';
import { PrismaTicketRepository } from 'src/infrastructure/database/repository/PrismaTicketRepository';

// Booking Use Cases
import {
    CreateBookingUseCase,
    GetBookingByIdUseCase,
    GetAllBookingsUseCase,
    UpdateBookingUseCase,
    CancelBookingUseCase,
    ConfirmBookingUseCase,
    DeleteBookingUseCase,
    GetUserBookingsUseCase,
    RefundBookingUseCase
} from 'src/application/uses-case/booking';

// Ticket Use Cases
import {
    CreateTicketUseCase,
    GetTicketByIdUseCase,
    GetAllTicketsUseCase,
    GetTicketsByBookingIdUseCase,
    UpdateTicketUseCase,
    DeleteTicketUseCase
} from 'src/application/uses-case/ticket';

// Controllers
import { BookingController } from 'src/presentation/controllers/BookingController';
import { TicketController } from 'src/presentation/controllers/TicketController';

// Services externes
import { MockAuthService } from 'src/infrastructure/adapters/external/MockAuthService';

@Module({
    controllers: [BookingController, TicketController],
    providers: [
        // Infrastructure
        PrismaService,
        
        // Repositories
        {
            provide: 'IBookingRepository',
            useFactory: (prisma: PrismaService) => new PrismaBookingRepository(prisma),
            inject: [PrismaService]
        },
        {
            provide: 'ITicketRepository',
            useFactory: (prisma: PrismaService) => new PrismaTicketRepository(prisma),
            inject: [PrismaService]
        },

        // External Services
        {
            provide: 'IAuthService',
            useClass: MockAuthService
        },

        // Booking Use Cases
        {
            provide: CreateBookingUseCase,
            useFactory: (bookingRepo, authService) => {
                return new CreateBookingUseCase(bookingRepo, authService);
            },
            inject: ['IBookingRepository', 'IAuthService']
        },
        {
            provide: GetBookingByIdUseCase,
            useFactory: (bookingRepo) => new GetBookingByIdUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: GetAllBookingsUseCase,
            useFactory: (bookingRepo) => new GetAllBookingsUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: UpdateBookingUseCase,
            useFactory: (bookingRepo) => new UpdateBookingUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: CancelBookingUseCase,
            useFactory: (bookingRepo) => new CancelBookingUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: ConfirmBookingUseCase,
            useFactory: (bookingRepo) => new ConfirmBookingUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: DeleteBookingUseCase,
            useFactory: (bookingRepo) => new DeleteBookingUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: GetUserBookingsUseCase,
            useFactory: (bookingRepo) => new GetUserBookingsUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },
        {
            provide: RefundBookingUseCase,
            useFactory: (bookingRepo) => new RefundBookingUseCase(bookingRepo),
            inject: ['IBookingRepository']
        },

        // Ticket Use Cases
        {
            provide: CreateTicketUseCase,
            useFactory: (ticketRepo, bookingRepo) => {
                return new CreateTicketUseCase(ticketRepo, bookingRepo);
            },
            inject: ['ITicketRepository', 'IBookingRepository']
        },
        {
            provide: GetTicketByIdUseCase,
            useFactory: (ticketRepo) => new GetTicketByIdUseCase(ticketRepo),
            inject: ['ITicketRepository']
        },
        {
            provide: GetAllTicketsUseCase,
            useFactory: (ticketRepo) => new GetAllTicketsUseCase(ticketRepo),
            inject: ['ITicketRepository']
        },
        {
            provide: GetTicketsByBookingIdUseCase,
            useFactory: (ticketRepo, bookingRepo) => {
                return new GetTicketsByBookingIdUseCase(ticketRepo, bookingRepo);
            },
            inject: ['ITicketRepository', 'IBookingRepository']
        },
        {
            provide: UpdateTicketUseCase,
            useFactory: (ticketRepo) => new UpdateTicketUseCase(ticketRepo),
            inject: ['ITicketRepository']
        },
        {
            provide: DeleteTicketUseCase,
            useFactory: (ticketRepo) => new DeleteTicketUseCase(ticketRepo),
            inject: ['ITicketRepository']
        }
    ],
    exports: []
})
export class BookingModule {}
