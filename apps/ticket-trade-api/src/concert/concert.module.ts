import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Concert, ConcertSchema } from './entities/concert.entity';
import { Artist, ArtistSchema } from '../artist/entities/artist.entity';
import { Location, LocationSchema } from '../location/entities/location.entity';
import { Neo4jService } from '../neo4j/neo4j.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
  ],
  controllers: [ConcertController],
  providers: [ConcertService, Neo4jService],
  exports: [MongooseModule],
})
export class ConcertModule {}
