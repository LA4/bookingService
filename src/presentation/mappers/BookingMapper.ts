import { CreateBookingDto } from 'src/application/uses-case/booking/createbooking/CreateBookingDto';
import { CreateBookingRequest, UpdateBookingRequest } from '../dto/request/BookingRequest';
import { BookingResponse, TicketResponse } from '../dto/response/BookingResponse';

import { Booking } from 'src/domain/entities/Booking';
import { Ticket } from 'src/domain/entities/Ticket';
import { UpdateBookingDto } from 'src/application/uses-case/booking/updateBooking/UpdateBookingDto';

export class BookingMapper {
  /**
   * Convertit CreateBookingRequest (HTTP) → CreateBookingDto (Application)
   */
  static toCreateDto(request: CreateBookingRequest): CreateBookingDto {
    const tickets = request.tickets.map(t => 
      new Ticket(
        '', // ID généré par le use case
        t.price,
        t.seatIds,
        t.seatLabel || null,
        t.showtimeId,
        t.userId
      )
    );

    return {
      userId: request.userId,
      showtimeId: request.showtimeId,
      seatIds: request.seatIds,
      totalPrice: request.totalPrice,
      status: undefined, // Défini par défaut dans le use case
      tickets: tickets
    } as CreateBookingDto;
  }

  /**
   * Convertit UpdateBookingRequest (HTTP) → UpdateBookingDto (Application)
   */
  static toUpdateDto(id: string, request: UpdateBookingRequest): UpdateBookingDto {
    return new UpdateBookingDto(
      id,
      request.status,
      request.seatIds,
      undefined // tickets non modifiables via update
    );
  }

  /**
   * Convertit Booking (Domain) → BookingResponse (HTTP)
   */
  static toResponse(booking: Booking): BookingResponse {
    return {
      id: booking.id,
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      status: booking.status,
      seatIds: booking.seatIds,
      totalPrice: booking.totalPrice,
      tickets: booking.tickets.map(t => this.ticketToResponse(t)),
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };
  }

  /**
   * Convertit un tableau de Bookings → BookingResponse[]
   */
  static toResponseArray(bookings: Booking[]): BookingResponse[] {
    return bookings.map(b => this.toResponse(b));
  }

  /**
   * Convertit Ticket (Domain) → TicketResponse (HTTP)
   */
  private static ticketToResponse(ticket: Ticket): TicketResponse {
    return {
      id: ticket.id,
      price: ticket.price,
      seatIds: ticket.seatIds,
      seatLabel: ticket.seatLabel,
      showtimeId: ticket.showtimeId,
      userId: ticket.userId,
      bookingId: ticket.bookingId
    };
  }
}
