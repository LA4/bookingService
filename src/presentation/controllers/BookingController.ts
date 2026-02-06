import { Controller, Get, Param, Post, Body, Put, Delete, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

import { CreateBookingRequest, UpdateBookingRequest, CancelBookingRequest, RefundBookingRequest, DeleteBookingRequest } from '../dto/request/BookingRequest';
import { BookingResponse, MessageResponse } from '../dto/response/BookingResponse';
import { BookingMapper } from '../mappers/BookingMapper';
import {
    CreateBookingRequestSwagger, UpdateBookingRequestSwagger, CancelBookingRequestSwagger, RefundBookingRequestSwagger, DeleteBookingRequestSwagger
} from '../dto/request/BookingRequest.swagger';
import { BookingResponseSwagger, MessageResponseSwagger } from '../dto/response/BookingResponse.swagger';
import { GetBookingByIdDto } from "src/application/uses-case/booking/getBookingById/GetBookingByIdDto";
import { GetUserBookingsDto } from "src/application/uses-case/booking/getUserBookings/GetUserBookingsDto";
import { ConfirmBookingDto } from "src/application/uses-case/booking/confirmBooking/ConfirmBookingDto";
import { CancelBookingDto } from "src/application/uses-case/booking/cancelBooking/CancelBookingDto";
import { RefundBookingDto } from "src/application/uses-case/booking/refundBooking/RefundBookingDto";
import { DeleteBookingDto } from "src/application/uses-case/booking/deleteBooking/DeleteBookingDto";
import { RefundBookingUseCase } from "src/application/uses-case/booking/refundBooking/RefundBookingUseCase";
import { GetUserBookingsUseCase } from "src/application/uses-case/booking/getUserBookings/GetUserBookingsUseCase";
import { DeleteBookingUseCase } from "src/application/uses-case/booking/deleteBooking/DeleteBookingUseCase";
import { ConfirmBookingUseCase } from "src/application/uses-case/booking/confirmBooking/ConfirmBookingUseCase";
import { CancelBookingUseCase } from "src/application/uses-case/booking/cancelBooking/CancelBookingUseCase";
import { CreateBookingUseCase } from "src/application/uses-case/booking/createbooking/CreateBookingUseCase";
import { GetBookingByIdUseCase } from "src/application/uses-case/booking/getBookingById/GetBookingByIdUseCase";
import { GetAllBookingsUseCase } from "src/application/uses-case/booking/getAllBookings/GetAllBookingsUseCase";
import { UpdateBookingUseCase } from "src/application/uses-case/booking/updateBooking/UpdateBookingUseCase";
import { AuthGuard } from "../guards/auth.guard";
import { AdminGuard } from "../guards/admin.guard";

@ApiTags('Bookings')
@Controller('bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class BookingController {

    constructor(
        private readonly createBookingUseCase: CreateBookingUseCase,
        private readonly getBookingByIdUseCase: GetBookingByIdUseCase,
        private readonly getAllBookingsUseCase: GetAllBookingsUseCase,
        private readonly updateBookingUseCase: UpdateBookingUseCase,
        private readonly cancelBookingUseCase: CancelBookingUseCase,
        private readonly confirmBookingUseCase: ConfirmBookingUseCase,
        private readonly deleteBookingUseCase: DeleteBookingUseCase,
        private readonly getUserBookingsUseCase: GetUserBookingsUseCase,
        private readonly refundBookingUseCase: RefundBookingUseCase
    ) { }

    @Get('admin')
    @ApiOperation({ summary: 'Get all bookings', description: 'Retrieves all bookings of all users in the system' })
    @ApiBearerAuth()
    @UseGuards(AdminGuard)
    @ApiResponse({ status: 200, description: 'List of all users bookings', type: [BookingResponseSwagger] })
    async findAll(): Promise<BookingResponse[]> {
        const bookings = await this.getAllBookingsUseCase.execute();
        return BookingMapper.toResponseArray(bookings);
    }

    @Put('admin/:id/refund')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refund booking', description: 'Refunds a cancelled booking' })
    @UseGuards(AdminGuard)
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiBody({ type: RefundBookingRequestSwagger })
    @ApiResponse({ status: 200, description: 'Booking refunded', type: MessageResponseSwagger })
    @ApiResponse({ status: 400, description: 'Only cancelled bookings can be refunded' })
    @ApiResponse({ status: 401, description: 'Unauthorized - not booking owner' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async refund(
        @Param('id') id: string,
        @Body() request: RefundBookingRequest
    ): Promise<MessageResponse> {
        const dto = new RefundBookingDto(id, request.userId);
        await this.refundBookingUseCase.execute(dto);
        return { message: 'Booking refunded successfully' };
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new booking', description: 'Creates a new booking with tickets for a showtime' })
    @ApiBody({ type: CreateBookingRequestSwagger, description: 'Booking creation data' })
    @ApiResponse({ status: 201, description: 'Booking created successfully', type: BookingResponseSwagger })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 401, description: 'Unauthorized user' })
    async create(@Body() request: CreateBookingRequest): Promise<BookingResponse> {
        const dto = BookingMapper.toCreateDto(request);
        const booking = await this.createBookingUseCase.execute(dto);
        return BookingMapper.toResponse(booking);
    }
    
    @Get(':id')
    @ApiOperation({ summary: 'Get booking by ID', description: 'Retrieves a specific booking by its ID' })
    @ApiParam({ name: 'id', description: 'Booking ID', example: 'booking-uuid' })
    @ApiResponse({ status: 200, description: 'Booking found', type: BookingResponseSwagger })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async findOne(@Param('id') id: string): Promise<BookingResponse> {
        const dto = new GetBookingByIdDto(id);
        const booking = await this.getBookingByIdUseCase.execute(dto);
        return BookingMapper.toResponse(booking);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get bookings by user', description: 'Retrieves all bookings for a specific user' })
    @ApiParam({ name: 'userId', description: 'User ID', example: 'user-123' })
    @ApiResponse({ status: 200, description: 'User bookings retrieved', type: [BookingResponseSwagger] })
    async findByUser(@Param('userId') userId: string): Promise<BookingResponse[]> {
        const dto = new GetUserBookingsDto(userId);
        const bookings = await this.getUserBookingsUseCase.execute(dto);
        return BookingMapper.toResponseArray(bookings);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update booking', description: 'Updates booking status and seat information' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiBody({ type: UpdateBookingRequestSwagger })
    @ApiResponse({ status: 200, description: 'Booking updated successfully', type: MessageResponseSwagger })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async update(
        @Param('id') id: string,
        @Body() request: UpdateBookingRequest
    ): Promise<MessageResponse> {
        const dto = BookingMapper.toUpdateDto(id, request);
        await this.updateBookingUseCase.execute(dto);
        return { message: 'Booking updated successfully' };
    }

    @Put(':id/confirm')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Confirm booking', description: 'Confirms a pending booking' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiResponse({ status: 200, description: 'Booking confirmed', type: MessageResponseSwagger })
    @ApiResponse({ status: 400, description: 'Only pending bookings can be confirmed' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async confirm(@Param('id') id: string): Promise<MessageResponse> {
        const dto = new ConfirmBookingDto(id);
        await this.confirmBookingUseCase.execute(dto);
        return { message: 'Booking confirmed successfully' };
    }

    @Put(':id/cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cancel booking', description: 'Cancels an existing booking' })
    @ApiParam({ name: 'id', description: 'Booking ID' })
    @ApiBody({ type: CancelBookingRequestSwagger })
    @ApiResponse({ status: 200, description: 'Booking cancelled', type: MessageResponseSwagger })
    @ApiResponse({ status: 400, description: 'Booking already cancelled or refunded' })
    @ApiResponse({ status: 401, description: 'Unauthorized - not booking owner' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async cancel(
        @Param('id') id: string,
        @Body() request: CancelBookingRequest
    ): Promise<MessageResponse> {
        const dto = new CancelBookingDto(id, request.userId);
        await this.cancelBookingUseCase.execute(dto);
        return { message: 'Booking cancelled successfully' };
    }

    
    // @Delete(':id')
    // @HttpCode(HttpStatus.NO_CONTENT)
    // @ApiOperation({ summary: 'Delete booking', description: 'Permanently deletes a booking' })
    // @ApiParam({ name: 'id', description: 'Booking ID' })
    // @ApiBody({ type: DeleteBookingRequestSwagger })
    // @ApiResponse({ status: 204, description: 'Booking deleted successfully' })
    // @ApiResponse({ status: 401, description: 'Unauthorized - not booking owner' })
    // @ApiResponse({ status: 404, description: 'Booking not found' })
    // async remove(
    //     @Param('id') id: string,
    //     @Body() request: DeleteBookingRequest
    // ): Promise<void> {
    //     const dto = new DeleteBookingDto(id, request.userId);
    //     await this.deleteBookingUseCase.execute(dto);
    // }
}