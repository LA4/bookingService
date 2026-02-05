import { Ticket } from '../entities/Ticket';

export interface ITicketRepository {
  create(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findByBookingId(bookingId: string): Promise<Ticket[]>;
  findAll(): Promise<Ticket[]>;
  update(ticket: Ticket): Promise<void>;
  delete(id: string): Promise<void>;
}