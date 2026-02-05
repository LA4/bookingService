import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    HttpCode,
    HttpStatus
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import {
    CreateTicketUseCase,
    GetTicketByIdUseCase,
    GetTicketByIdDto,
    GetAllTicketsUseCase,
    GetTicketsByBookingIdUseCase,
    GetTicketsByBookingIdDto,
    UpdateTicketUseCase,
    DeleteTicketUseCase,
    DeleteTicketDto
} from "src/application/uses-case/ticket";
import {
    CreateTicketRequest,
    UpdateTicketRequest,
    DeleteTicketRequest
} from '../dto/request/TicketRequest';
import { TicketResponse } from '../dto/response/TicketResponse';
import { TicketMapper } from '../mappers/TicketMapper';
import {
    CreateTicketRequestSwagger,
    UpdateTicketRequestSwagger,
    DeleteTicketRequestSwagger
} from '../dto/request/TicketRequest.swagger';
import { TicketResponseSwagger } from '../dto/response/BookingResponse.swagger';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {

    constructor(
        private readonly createTicketUseCase: CreateTicketUseCase,
        private readonly getTicketByIdUseCase: GetTicketByIdUseCase,
        private readonly getAllTicketsUseCase: GetAllTicketsUseCase,
        private readonly getTicketsByBookingIdUseCase: GetTicketsByBookingIdUseCase,
        private readonly updateTicketUseCase: UpdateTicketUseCase,
        private readonly deleteTicketUseCase: DeleteTicketUseCase
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new ticket', description: 'Creates a new ticket for an existing booking' })
    @ApiBody({ type: CreateTicketRequestSwagger, description: 'Ticket creation data' })
    @ApiResponse({ status: 201, description: 'Ticket created successfully', type: TicketResponseSwagger })
    @ApiResponse({ status: 400, description: 'Invalid request data' })
    @ApiResponse({ status: 401, description: 'Unauthorized - not booking owner' })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async create(@Body() request: CreateTicketRequest): Promise<TicketResponse> {
        const dto = TicketMapper.toCreateDto(request);
        const ticket = await this.createTicketUseCase.execute(dto);
        return TicketMapper.toResponse(ticket);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tickets', description: 'Retrieves all tickets in the system' })
    @ApiResponse({ status: 200, description: 'List of all tickets', type: [TicketResponseSwagger] })
    async findAll(): Promise<TicketResponse[]> {
        const tickets = await this.getAllTicketsUseCase.execute();
        return TicketMapper.toResponseArray(tickets);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ticket by ID', description: 'Retrieves a specific ticket by its ID' })
    @ApiParam({ name: 'id', description: 'Ticket ID', example: 'ticket-uuid' })
    @ApiResponse({ status: 200, description: 'Ticket found', type: TicketResponseSwagger })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    async findOne(@Param('id') id: string): Promise<TicketResponse> {
        const dto = new GetTicketByIdDto(id);
        const ticket = await this.getTicketByIdUseCase.execute(dto);
        return TicketMapper.toResponse(ticket);
    }

    @Get('booking/:bookingId')
    @ApiOperation({ summary: 'Get tickets by booking ID', description: 'Retrieves all tickets for a specific booking' })
    @ApiParam({ name: 'bookingId', description: 'Booking ID', example: 'booking-uuid' })
    @ApiResponse({ status: 200, description: 'Tickets retrieved', type: [TicketResponseSwagger] })
    @ApiResponse({ status: 404, description: 'Booking not found' })
    async findByBooking(@Param('bookingId') bookingId: string): Promise<TicketResponse[]> {
        const dto = new GetTicketsByBookingIdDto(bookingId);
        const tickets = await this.getTicketsByBookingIdUseCase.execute(dto);
        return TicketMapper.toResponseArray(tickets);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update ticket', description: 'Updates ticket information' })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    @ApiBody({ type: UpdateTicketRequestSwagger })
    @ApiResponse({ status: 200, description: 'Ticket updated successfully', type: TicketResponseSwagger })
    @ApiResponse({ status: 401, description: 'Unauthorized - not ticket owner' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    async update(
        @Param('id') id: string,
        @Body() request: UpdateTicketRequest
    ): Promise<TicketResponse> {
        const dto = TicketMapper.toUpdateDto(id, request);
        const ticket = await this.updateTicketUseCase.execute(dto);
        return TicketMapper.toResponse(ticket);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete ticket', description: 'Permanently deletes a ticket' })
    @ApiParam({ name: 'id', description: 'Ticket ID' })
    @ApiBody({ type: DeleteTicketRequestSwagger })
    @ApiResponse({ status: 204, description: 'Ticket deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - not ticket owner' })
    @ApiResponse({ status: 404, description: 'Ticket not found' })
    async remove(
        @Param('id') id: string, 
        @Body() request: DeleteTicketRequest
    ): Promise<void> {
        const dto = new DeleteTicketDto(id, request.userId);
        await this.deleteTicketUseCase.execute(dto);
    }
}
