import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { UpdateBookingDto } from './UpdateBookingDto';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class UpdateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: UpdateBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Mettre à jour les propriétés modifiables via les méthodes métier
    if (dto.status) {
      booking.updateStatus(dto.status);
    }

    if (dto.seatIds) {
      booking.updateSeats(dto.seatIds);
    }

    if (dto.tickets) {
      booking.updateTickets(dto.tickets);
    }

    // Sauvegarder le booking modifié
    await this.bookingRepository.update(booking);
  }
}
