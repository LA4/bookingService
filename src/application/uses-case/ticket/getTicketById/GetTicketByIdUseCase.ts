import { Injectable, Inject } from '@nestjs/common';
import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { GetTicketByIdDto } from './GetTicketByIdDto';
import { TICKET_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class GetTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository
  ) {}

  async execute(dto: GetTicketByIdDto): Promise<Ticket> {
    const ticket = await this.ticketRepository.findById(dto.ticketId);

    if (!ticket) {
      throw new Error(`Ticket with id ${dto.ticketId} not found`);
    }

    return ticket;
  }
}
