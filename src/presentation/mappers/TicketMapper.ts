import { CreateTicketRequest, UpdateTicketRequest } from '../dto/request/TicketRequest';
import { TicketResponse } from '../dto/response/TicketResponse';
import { CreateTicketDto, UpdateTicketDto } from 'src/application/uses-case/ticket';
import { Ticket } from 'src/domain/entities/Ticket';

export class TicketMapper {
  /**
   * Convertit CreateTicketRequest (HTTP) → CreateTicketDto (Application)
   */
  static toCreateDto(request: CreateTicketRequest): CreateTicketDto {
    return new CreateTicketDto(
      request.price,
      request.seatIds,
      request.seatLabel || null,
      request.showtimeId,
      request.userId,
      request.bookingId
    );
  }

  /**
   * Convertit UpdateTicketRequest (HTTP) → UpdateTicketDto (Application)
   */
  static toUpdateDto(id: string, request: UpdateTicketRequest): UpdateTicketDto {
    return new UpdateTicketDto(
      id,
      request.userId,
      request.price,
      request.seatIds,
      request.seatLabel
    );
  }

  /**
   * Convertit Ticket (Domain) → TicketResponse (HTTP)
   */
  static toResponse(ticket: Ticket): TicketResponse {
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

  /**
   * Convertit un tableau de Tickets → TicketResponse[]
   */
  static toResponseArray(tickets: Ticket[]): TicketResponse[] {
    return tickets.map(t => this.toResponse(t));
  }
}
