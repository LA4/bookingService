import { Ticket } from '../entites/Ticket';

export interface ITicketRepository {
  create(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  update(ticket: Ticket): Promise<void>;
  delete(id: string): Promise<void>;
}