import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { Booking } from 'src/domain/entities/booking/Booking';
import { UpdateBookingDto } from './UpdateBookingDto';

export class UpdateBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(dto: UpdateBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Mettre à jour les propriétés modifiables
    if (dto.status) {
      booking.status = dto.status;
    }

    if (dto.seatIds) {
      booking.seatIds = dto.seatIds;
    }

    if (dto.tickets) {
      booking.tickets = dto.tickets;
    }

    await this.bookingRepository.update(booking);
  }
}
