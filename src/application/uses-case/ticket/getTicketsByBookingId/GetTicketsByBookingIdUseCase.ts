import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Ticket } from 'src/domain/entities/Ticket';
import { GetTicketsByBookingIdDto } from './GetTicketsByBookingIdDto';

export class GetTicketsByBookingIdUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: GetTicketsByBookingIdDto): Promise<Ticket[]> {
    // Vérifier que le booking existe
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    return await this.ticketRepository.findByBookingId(dto.bookingId);
  }
}
