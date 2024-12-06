import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert, ConcertDocument } from './entities/concert.entity';
import { Artist, ArtistDocument } from '../artist/entities/artist.entity';
import { Location, LocationDocument } from '../location/entities/location.entity';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class ConcertService {

  constructor(
    @InjectModel(Concert.name) private readonly concertModel: Model<ConcertDocument>,
    @InjectModel(Artist.name) private readonly artistModel: Model<ArtistDocument>,
    @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>,
    private readonly neo4jService: Neo4jService
  ) {}

  async create(createConcertDto: CreateConcertDto) {
    try {
      const { artistId, locationId, ...concertData } = createConcertDto;
    
      const artist = await this.artistModel.findById(artistId).exec();
      if (!artist) {
        throw new NotFoundException(`Artist with ID ${artistId} not found`);
      }
    
      const location = await this.locationModel.findById(locationId).exec();
      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }
    
      const newConcert = new this.concertModel({
        ...concertData,
        artist,
        location,
      });
    
      await newConcert.save();
      return newConcert.toObject();
    
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        // Duplicate key error
        throw new ConflictException(`Concert with the same ${Object.keys(error.keyValue)[0]} already exists`);
      }
      throw error;
    }
    
  }

  async findAll() {
    try {
      return await this.concertModel.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const Concert = await this.concertModel.findById(id);
      return Concert;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`Concert with ID ${id} not found`);
    }
  }

  async update(id: string, updateConcertDto: UpdateConcertDto) {
    try {
      const { artistId, locationId, ...concertData } = updateConcertDto;
  
      const artist = await this.artistModel.findById(artistId).exec();
      if (!artist) {
        throw new NotFoundException(`Artist with ID ${artistId} not found`);
      }
  
      const location = await this.locationModel.findById(locationId).exec();
      if (!location) {
        throw new NotFoundException(`Location with ID ${locationId} not found`);
      }
  
      const updatedConcert = await this.concertModel.findByIdAndUpdate(
        id,
        {
          ...concertData,
          artist, 
          location, 
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Validate the update
        },
      );
  
      if (!updatedConcert) {
        throw new NotFoundException(`Concert with ID ${id} not found`);
      }
  
      return updatedConcert.toObject();
    } catch (error) {
      console.error(error);
  
      if (error.code === 11000) {
        throw new ConflictException(
          `Concert with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const deletedConcert = await this.concertModel.findByIdAndDelete(id);

      if (!deletedConcert) {
        throw new NotFoundException(`Concert with ID ${id} not found`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getConcertRecommendations(userId: string){
    const session = this.neo4jService.getSession();
    const result = await session.run(
      `MATCH (user:User {id: $userId})-[:FOLLOWS]->(friend:User)-[:ATTENDS]->(concert:Concert)
       WHERE NOT (user)-[:ATTENDS]->(concert)
       AND NOT EXISTS {
         MATCH (user)-[:ATTENDS]->(conflicting:Concert)
         WHERE conflicting.start < concert.end AND conflicting.end > concert.start
       }
       RETURN concert.id AS recommendedConcertId, concert.name AS concertName, COUNT(friend) AS attendingFriendsCount
       ORDER BY attendingFriendsCount DESC
       LIMIT 5`,
      { userId }
    );
  
    return result.records.map(record => ({
      recommendedConcertId: record.get('recommendedConcertId'),
      concertName: record.get('concertName'),
      attendingFriendsCount: record.get('attendingFriendsCount'),
    }));
  }
}
