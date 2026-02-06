import { Injectable, Inject } from '@nestjs/common';
import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { TICKET_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class GetAllTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: ITicketRepository
  ) {}

  async execute(): Promise<Ticket[]> {
    return await this.ticketRepository.findAll();
  }
}
