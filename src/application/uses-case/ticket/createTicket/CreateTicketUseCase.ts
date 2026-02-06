import { Injectable, Inject } from '@nestjs/common';
import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { CreateTicketDto } from './CreateTicketDto';
import { v4 as uuid } from 'uuid';
import { TICKET_REPOSITORY, BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class CreateTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository,
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: CreateTicketDto): Promise<Ticket> {
    // Vérifier que le booking existe
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Vérifier que l'utilisateur est le propriétaire du booking
    if (booking.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only create tickets for your own bookings');
    }

    // Créer le ticket
    const ticket = new Ticket(
      uuid(),
      dto.price,
      dto.seatIds,
      dto.seatLabel,
      dto.showtimeId,
      dto.userId,
      dto.bookingId
    );

    await this.ticketRepository.create(ticket);

    const createdTicket = await this.ticketRepository.findById(ticket.id);

    if (!createdTicket) {
      throw new Error('Failed to create ticket');
    }

    return createdTicket;
  }
}