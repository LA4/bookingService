import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { GetTicketByIdDto } from './GetTicketByIdDto';

export class GetTicketByIdUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(dto: GetTicketByIdDto): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(dto.ticketId);

    if (!ticket) {
      throw new Error(`Ticket with id ${dto.ticketId} not found`);
    }

    return ticket;
  }
}
