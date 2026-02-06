import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { ConfirmBookingDto } from './ConfirmBookingDto';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class ConfirmBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: ConfirmBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Vérifier que la réservation est en attente
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }

    // Confirmer la réservation
    booking.status = BookingStatus.CONFIRMED;

    await this.bookingRepository.update(booking);
  }
}
