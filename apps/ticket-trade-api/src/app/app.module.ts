import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertController } from '../concert/concert.controller';
import { GenreController } from '../genre/genre.controller';
import { LocationController } from '../location/location.controller';
import { TicketController } from '../ticket/ticket.controller';
import { UserController } from '../user/user.controller';
import { ArtistService } from '../artist/artist.service';
import { ArtistController } from '../artist/artist.controller';
import { ConcertService } from '../concert/concert.service';
import { GenreService } from '../genre/genre.service';
import { LocationService } from '../location/location.service';
import { TicketService } from '../ticket/ticket.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ArtistController,
    ConcertController,
    GenreController,
    LocationController,
    TicketController,
    UserController
  ],
  providers: [
    AppService,
    ArtistService,
    ConcertService,
    GenreService,
    LocationService,
    TicketService,
    UserService
  ],
})
export class AppModule {}
