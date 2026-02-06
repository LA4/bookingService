import { Injectable, Inject } from '@nestjs/common';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { CancelBookingDto } from './CancelBookingDto';
import { BOOKING_REPOSITORY } from 'src/domain/repositories/tokens';

@Injectable()
export class CancelBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute(dto: CancelBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);

    if (!booking) {
      throw new Error(`Booking with id ${dto.bookingId} not found`);
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (booking.userId !== dto.userId) {
      throw new Error('Unauthorized: You can only cancel your own bookings');
    }

    // Vérifier que la réservation peut être annulée
    if (booking.status === BookingStatus.CANCELLED) {
      throw new Error('Booking is already cancelled');
    }

    if (booking.status === BookingStatus.REFUNDED) {
      throw new Error('Cannot cancel a refunded booking');
    }

    // Mettre à jour le statut
    booking.status = BookingStatus.CANCELLED;

    await this.bookingRepository.update(booking);
  }
}
