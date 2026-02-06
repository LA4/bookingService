// prisma/seed.ts
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Démarrage du seed...');

    // Nettoyage des données existantes
    await prisma.ticket.deleteMany();
    await prisma.booking.deleteMany();
    console.log('Base de données nettoyée');

    // Premier booking: CONFIRMED avec 2 tickets
    const booking1 = await prisma.booking.create({
        data: {
            id: 'booking-001',
            status: 'CONFIRMED',
            totalPrice: 28.50,
            userId: 'user-123',
            showtimeId: 'showtime-456',
            seatIds: ['A1', 'A2'],
            tickets: {
                create: [
                    {
                        id: 'ticket-001',
                        price: 14.50,
                        seatIds: ['A1'],
                        seatLabel: 'A1',
                        showtimeId: 'showtime-456',
                        userId: 'user-123',
                    },
                    {
                        id: 'ticket-002',
                        price: 14.00,
                        seatIds: ['A2'],
                        seatLabel: 'A2',
                        showtimeId: 'showtime-456',
                        userId: 'user-123',
                    },
                ],
            },
        },
        include: {
            tickets: true,
        },
    });
    console.log(`Booking 1 créé: ${booking1.id} (${booking1.tickets.length} tickets)`);

    // Deuxième booking: PENDING avec 1 ticket
    const booking2 = await prisma.booking.create({
        data: {
            id: 'booking-002',
            status: 'PENDING',
            totalPrice: 12.00,
            userId: 'user-789',
            showtimeId: 'showtime-789',
            seatIds: ['B5'],
            tickets: {
                create: {
                    id: 'ticket-003',
                    price: 12.00,
                    seatIds: ['B5'],
                    seatLabel: 'B5',
                    showtimeId: 'showtime-789',
                    userId: 'user-789',
                },
            },
        },
        include: {
            tickets: true,
        },
    });
    console.log(`Booking 2 créé: ${booking2.id} (${booking2.tickets.length} tickets)`);

    console.log('Seed terminé avec succès!');
    console.log(`Total: ${2} bookings et ${3} tickets créés`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});