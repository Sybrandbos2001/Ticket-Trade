import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './entities/ticket.entity';
import { Concert, ConcertSchema } from '../concert/entities/concert.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { Neo4jService } from '../neo4j/neo4j.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TicketController],
  providers: [TicketService, Neo4jService],
  exports: [MongooseModule],
})
export class TicketModule {}
