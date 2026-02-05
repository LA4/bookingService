import { Booking } from 'src/domain/entities/booking/Booking';
import { Ticket } from 'src/domain/entities/Ticket';
import { IBookingRepository } from 'src/domain/repositories/IbookingRepository';
import { PrismaService } from 'src/infrastructure/http/PrismaService';
import { BookingStatus } from 'src/domain/ValueObject/BookingStatus';
import { Prisma } from '@prisma/client';


export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(booking: Booking): Promise<void> {
    await this.prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        showtimeId: booking.showtimeId,
        status: booking.status,
        totalPrice: new Prisma.Decimal(booking.totalPrice),
        seatIds: booking.seatIds,
        tickets: {
          create: booking.tickets.map((ticket) => ({
            id: ticket.id,
            price: new Prisma.Decimal(ticket.price),
            seatIds: ticket.seatIds,
            seatLabel: ticket.seatLabel,
            showtimeId: ticket.showtimeId,
            userId: ticket.userId,
          })),
        },
      },
      include: {
        tickets: true,
      },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const data = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    });

    return data ? this.toDomain(data) : null;
  }

  async findAll(): Promise<Booking[]> {
    const data = await this.prisma.booking.findMany({
      include: {
        tickets: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((booking) => this.toDomain(booking));
  }

  async update(booking: Booking): Promise<void> {
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
        seatIds: booking.seatIds,
        totalPrice: new Prisma.Decimal(booking.totalPrice),
        tickets: {
          deleteMany: {},
          create: booking.tickets.map((ticket) => ({
            id: ticket.id,
            price: new Prisma.Decimal(ticket.price),
            seatIds: ticket.seatIds,
            seatLabel: ticket.seatLabel,
            showtimeId: ticket.showtimeId,
            userId: ticket.userId,
          })),
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({
      where: { id },
    });
  }

  private toDomain(prismaData: any): Booking {
    const tickets = prismaData.tickets.map(
      (t: any) =>
        new Ticket(
          t.id,
          Number(t.price),
          t.seatIds,
          t.seatLabel,
          t.showtimeId,
          t.userId
        )
    );

    return Booking.createBooking({
      id: prismaData.id,
      createdAt: prismaData.createdAt,
      updatedAt: prismaData.updatedAt,
      status: prismaData.status as BookingStatus,
      seatIds: prismaData.seatIds,
      totalPrice: Number(prismaData.totalPrice),
      userId: prismaData.userId,
      showtimeId: prismaData.showtimeId,
      tickets: tickets,
    } as any);
  }
}