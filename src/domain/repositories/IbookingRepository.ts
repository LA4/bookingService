import { Booking } from '../entities/Booking';

export interface IBookingRepository {
  create(booking: Booking): Promise<void>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  update(booking: Booking): Promise<void>;
  delete(id: string): Promise<void>;
}