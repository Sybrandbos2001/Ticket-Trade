import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { ArtistModule } from '../artist/artist.module';
import { ConcertModule } from '../concert/concert.module';
import { GenreModule } from '../genre/genre.module';
import { LocationModule } from '../location/location.module';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Load environment variables and make them available globally
    ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
    
    // Database connection
    MongooseModule.forRoot(process.env.MONGO_URL),
    
    // Feature modules
    ArtistModule,
    ConcertModule,
    GenreModule,
    LocationModule,
    TicketModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
