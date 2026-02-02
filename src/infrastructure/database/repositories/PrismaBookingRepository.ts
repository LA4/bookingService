import { PrismaClient } from '@prisma/client';
import { Booking } from 'src/domain/entites/Booking';
import { Ticket } from 'src/domain/entites/Ticket';
import { IBookingRepository } from 'src/domain/repositories/IBookingRepository';

class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(booking: Booking): Promise<void> {
    await this.prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        showtimeId: booking.showtimeId,
        totalPrice: booking.totalPrice,
        status: booking.status as any, // Cast necessaire car les enums sont techniquement différents
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt || new Date(),
        tickets: {
          create: booking.tickets.map((ticket) => ({
            id: (ticket as any).id,
            price: (ticket as any).price,
            seatId: (ticket as any).seatId,
            seatLabel: (ticket as any).seatLabel,
            showtimeId: (ticket as any).showtimeId,
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<Booking | null> {
    const prismaBooking = await this.prisma.booking.findUnique({
      where: { id },
      include: { tickets: true },
    });

    if (!prismaBooking) return null;

    return Booking.create(
      prismaBooking.id,
      prismaBooking.createdAt,
      prismaBooking.updatedAt,
      prismaBooking.status as any,
      Number(prismaBooking.totalPrice), // Conversion Decimal Prisma -> number JS
      prismaBooking.userId,
      prismaBooking.showtimeId,
      // Mapping des tickets
      prismaBooking.tickets.map((t) =>
        Ticket.create(
          t.id,
          Number(t.price),
          t.seatId,
          t.seatLabel || '',
          t.showtimeId,
          new Date(),
          t.bookingId,
        ),
      ),
    );
  }

  async findAll(): Promise<Booking[]> {
    const prismaBookings = await this.prisma.booking.findMany({
      include: { tickets: true },
    });

    return prismaBookings.map((pb) =>
      Booking.create(
        pb.id,
        pb.createdAt,
        pb.updatedAt,
        pb.status as any,
        Number(pb.totalPrice),
        pb.userId,
        pb.showtimeId,
        pb.tickets.map((t) =>
          Ticket.create(
            t.id,
            Number(t.price),
            t.seatId,
            t.seatLabel || '',
            t.showtimeId,
            new Date(),
            t.bookingId,
          ),
        ),
      ),
    );
  }

  async update(booking: Booking): Promise<void> {
    await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status as any,
        totalPrice: booking.totalPrice,
        updatedAt: booking.updatedAt || new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.booking.delete({
      where: { id },
    });
  }
}