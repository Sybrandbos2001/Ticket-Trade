import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket, TicketDocument } from './entities/ticket.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Concert, ConcertDocument } from '../concert/entities/concert.entity';
import { User, UserDocument } from '../user/entities/user.entity';

@Injectable()
export class TicketService {

  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>,
    @InjectModel(Concert.name) private readonly concertModel: Model<ConcertDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(userId : string, createTicketDto: CreateTicketDto) {
    try {
      const { concertId, ...TicketData } = createTicketDto;
    
      const concert = await this.concertModel.findById(concertId).exec();
      if (!concert) {
        throw new NotFoundException(`Concert with ID ${concertId} not found`);
      }
    
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    
      const newTicket = new this.ticketModel({
        ...TicketData,
        concert,
        userId,
      });
    
      await newTicket.save();

      await this.userModel.updateOne(
        { _id: userId },
        { $addToSet: { tickets: newTicket } }
      );

      return newTicket.toObject();
    
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException(`Ticket with the same ${Object.keys(error.keyValue)[0]} already exists`);
      }
      throw error;
    }
    
  }

  async findAll(userId : string) {
    try {
      return await this.ticketModel.find({ userId: userId });
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(userId : string, id: string) {
    try {
      const ticket = await this.ticketModel.findById(id);
      if(!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }

      if(ticket.userId !== userId) {
        throw new ForbiddenException(`User is not authorized to access this ticket`);
      }
      return ticket;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async scanTicket(userId : string, id: string) {
    try {
      const ticket = await this.ticketModel.findById(id);
      if(!ticket) {
        throw new NotFoundException(`Ticket with ID ${id} not found`);
      }
      
      if(ticket.userId !== userId) {
        throw new ForbiddenException(`User is not authorized to access this ticket`);
      }

      if(ticket.used) {
        throw new ForbiddenException(`Ticket with ID ${id} has already been used`);
      }

      const updatedTicket = await this.ticketModel.findByIdAndUpdate(
        id,
        {
          used: true,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the update
        },
      );

      return updatedTicket;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}
