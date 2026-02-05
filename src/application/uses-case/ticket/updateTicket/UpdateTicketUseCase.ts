import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { UpdateTicketDto } from './UpdateTicketDto';

export class UpdateTicketUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(dto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(dto.ticketId);

    if (!ticket) {
      throw new Error(`Ticket with id ${dto.ticketId} not found`);
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (ticket.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only update your own tickets');
    }

    // Créer un nouveau ticket avec les valeurs mises à jour
    const updatedTicket = new Ticket(
      ticket.id,
      dto.price ?? ticket.price,
      dto.seatIds ?? ticket.seatIds,
      dto.seatLabel !== undefined ? dto.seatLabel : ticket.seatLabel,
      ticket.showtimeId,
      ticket.userId,
      ticket.bookingId
    );

    await this.ticketRepository.update(updatedTicket);

    const result = await this.ticketRepository.findById(ticket.id);

    if (!result) {
      throw new Error('Failed to update ticket');
    }

    return result;
  }
}
