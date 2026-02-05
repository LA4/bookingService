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

    // const booking = await prisma.booking.create({
    //     data: {
    //         id: '1',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         status: 'PENDING',
    //         totalPrice: 10,
    //         userId: '1',
    //         showtimeId: '1',
    //         tickets: {
    //             create: {
    //                 id: '1',
    //                 price: 10,
    //                 seatIds: ['1'],
    //                 seatLabel: 'A1',
    //                 showtimeId: '1',
    //             },
    //         },
    //     },
    // });
    // const ticket = await prisma.ticket.create({
    //     data: {
    //         id: '1',
    //         price: 10,
    //         seatIds: ['1'],
    //         seatLabel: 'A1',
    //         showtimeId: '1',
    //         bookingId: '1',
    //     },
    // });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});