import { Module } from '@nestjs/common';
import { Booking } from './entites/Booking';
import { Ticket } from './entites/Ticket';
import { BookingStatus } from './value-objects/bookingStatus';

@Module({
    providers: [],
    exports: [],
})
export class DomainModule { }
