import { Module } from '@nestjs/common';
import { CreateBookingUseCase } from './uses-case/booking/createbooking/CreateBookingUseCase';
import { GetBookingByIdUseCase } from './uses-case/booking/getBookingById/GetBookingByIdUseCase';
import { UpdateBookingUseCase } from './uses-case/booking/updateBooking/UpdateBookingUseCase';
import { DeleteBookingUseCase } from './uses-case/booking/deleteBooking/DeleteBookingUseCase';
import { CancelBookingUseCase } from './uses-case/booking/cancelBooking/CancelBookingUseCase';
import { ConfirmBookingUseCase } from './uses-case/booking/confirmBooking/ConfirmBookingUseCase';
import { GetAllBookingsUseCase } from './uses-case/booking/getAllBookings/GetAllBookingsUseCase';
import { GetUserBookingsUseCase } from './uses-case/booking/getUserBookings/GetUserBookingsUseCase';
import { RefundBookingUseCase } from './uses-case/booking/refundBooking/RefundBookingUseCase';
import { CreateTicketUseCase } from './uses-case/ticket/createTicket/CreateTicketUseCase';
import { DeleteTicketUseCase } from './uses-case/ticket/deleteTicket/DeleteTicketUseCase';
import { GetAllTicketsUseCase } from './uses-case/ticket/getAllTickets/GetAllTicketsUseCase';
import { GetTicketByIdUseCase } from './uses-case/ticket/getTicketById/GetTicketByIdUseCase';
import { GetTicketsByBookingIdUseCase } from './uses-case/ticket/getTicketsByBookingId/GetTicketsByBookingIdUseCase';
import { UpdateTicketUseCase } from './uses-case/ticket/updateTicket/UpdateTicketUseCase';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';


@Module({
    imports: [InfrastructureModule],
    providers: [
        CreateBookingUseCase,
        GetBookingByIdUseCase,
        UpdateBookingUseCase,
        DeleteBookingUseCase,
        CancelBookingUseCase,
        ConfirmBookingUseCase,
        GetAllBookingsUseCase,
        GetUserBookingsUseCase,
        RefundBookingUseCase,
        CreateTicketUseCase,
        DeleteTicketUseCase,
        GetAllTicketsUseCase,
        GetTicketByIdUseCase,
        GetTicketsByBookingIdUseCase,
        UpdateTicketUseCase
    ],
    exports: [
        CreateBookingUseCase,
        GetBookingByIdUseCase,
        UpdateBookingUseCase,
        DeleteBookingUseCase,
        CancelBookingUseCase,
        ConfirmBookingUseCase,
        GetAllBookingsUseCase,
        GetUserBookingsUseCase,
        RefundBookingUseCase,
        CreateTicketUseCase,
        DeleteTicketUseCase,
        GetAllTicketsUseCase,
        GetTicketByIdUseCase,
        GetTicketsByBookingIdUseCase,
        UpdateTicketUseCase
    ],
})
export class ApplicationModule {}