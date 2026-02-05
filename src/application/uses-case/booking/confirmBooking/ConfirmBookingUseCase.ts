import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { ConfirmBookingDto } from './ConfirmBookingDto';

export class ConfirmBookingUseCase {
  constructor(private readonly bookingRepository: IBookingRepository) {}

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
