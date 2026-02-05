import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { Ticket } from 'src/domain/entities/Ticket';

export class GetAllTicketsUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }
}
