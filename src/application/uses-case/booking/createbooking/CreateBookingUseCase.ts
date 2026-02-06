import { Injectable, Inject } from '@nestjs/common';
import { Booking } from 'src/domain/entities/Booking';
import { CreateBookingDto } from './CreateBookingDto';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { IAuthService } from 'src/domain/repositories/IExternalServices';
import { BOOKING_REPOSITORY, AUTH_SERVICE } from 'src/domain/repositories/tokens';

@Injectable()
export class CreateBookingUseCase {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: IBookingRepository,
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService
  ) {}

  async execute(dto: CreateBookingDto): Promise<Booking> {
    // Valider l'utilisateur via le service externe Auth
    const userValid = await this.authService.getUserByID(dto.userId);

    if (!userValid) {
      throw new Error('Unauthorized: Invalid user');
    }

    // Créer l'entité Booking
    const booking = Booking.createBooking({
      seatIds: dto.seatIds,
      totalPrice: dto.totalPrice,
      userId: userValid.id,
      showtimeId: dto.showtimeId,
      tickets: dto.tickets,
    } as Booking);

    // Persister le booking
    await this.bookingRepository.create(booking);

    // Récupérer le booking créé pour le retourner
    const createdBooking = await this.bookingRepository.findById(booking.id);

    if (!createdBooking) {
      throw new Error('Failed to create booking');
    }

    return createdBooking;
  }
}

