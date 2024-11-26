import { Controller, Request, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { IAuthRequest, Role } from '@ticket-trade/domain';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create Ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully', type: Ticket })
  async create(@Body() createTicketDto: CreateTicketDto, @Request() req: IAuthRequest) : Promise<object> {
    const userID = req.user.sub; 
    const newTicket = await this.ticketService.create(userID, createTicketDto);
    return {
      message: 'Ticket created successfully',
      Ticket: newTicket,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Retrieve all Tickets' })
  @ApiResponse({ status: 200, description: 'List of all Tickets', type: [Ticket] })
  @Get()
  async findAll(@Request() req: IAuthRequest) {
    const userID = req.user.sub; 
    return await this.ticketService.findAll(userID);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Retrieve single Ticket by ID' })
  @ApiResponse({ status: 200, description: 'Single Ticket by ID', type: Ticket })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: IAuthRequest) {
    const userID = req.user.sub; 
    return this.ticketService.findOne(userID, id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Scan Ticket' })
  @ApiResponse({ status: 201, description: 'Ticket scanned successfully' })
  @Patch('scan/:id')
  async scanTicket(@Param('id') id: string, @Request() req: IAuthRequest) : Promise<object> {
    const userID = req.user.sub; 
    const scannedTicket = await this.ticketService.scanTicket(userID, id);
    return {
      message: 'Ticket scanned successfully',
      scannedTicket: scannedTicket,
    };
  }
}
