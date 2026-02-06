import { Prisma } from '@prisma/client';
import { Ticket } from 'src/domain/entities/Ticket';
import { ITicketRepository } from 'src/domain/repositories/ITicketRepository';

import { PrismaService } from 'src/infrastructure/database/prisma/PrismaService';

export class PrismaTicketRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(ticket: Ticket): Promise<void> {
    await this.prisma.ticket.create({
      data: {
        id: ticket.id,
        price: new Prisma.Decimal(ticket.price),
        seatIds: ticket.seatIds,
        seatLabel: ticket.seatLabel,
        showtimeId: ticket.showtimeId,
        userId: ticket.userId,
        bookingId: ticket.bookingId,
      },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const data = await this.prisma.ticket.findUnique({
      where: { id },
    });

    return data ? this.toDomain(data) : null;
  }

  async findByBookingId(bookingId: string): Promise<Ticket[]> {
    const data = await this.prisma.ticket.findMany({
      where: { bookingId },
    });

    return data.map((ticket) => this.toDomain(ticket));
  }

  async findAll(): Promise<Ticket[]> {
    const data = await this.prisma.ticket.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return data.map((ticket) => this.toDomain(ticket));
  }

  async update(ticket: Ticket): Promise<void> {
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        price: new Prisma.Decimal(ticket.price),
        seatIds: ticket.seatIds,
        seatLabel: ticket.seatLabel,
        showtimeId: ticket.showtimeId,
        userId: ticket.userId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: { id },
    });
  }

  private toDomain(prismaData: any): Ticket {
    return new Ticket(
      prismaData.id,
      Number(prismaData.price),
      prismaData.seatIds,
      prismaData.seatLabel,
      prismaData.showtimeId,
      prismaData.userId,
      prismaData.bookingId
    );
  }
}
