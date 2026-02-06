import { Injectable, Inject } from '@nestjs/common';
import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { DeleteTicketDto } from './DeleteTicketDto';
import { TICKET_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class DeleteTicketUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository
  ) {}

  async execute(dto: DeleteTicketDto): Promise<void> {
    const ticket = await this.ticketRepository.findById(dto.ticketId);

    if (!ticket) {
      throw new Error(`Ticket with id ${dto.ticketId} not found`);
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (ticket.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only delete your own tickets');
    }

    await this.ticketRepository.delete(dto.ticketId);
  }
}
