import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from './entities/artist.entity';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from '../genre/entities/genre.entity';

@Injectable()
export class ArtistService {

  constructor(
    @InjectModel(Artist.name) private readonly ArtistModel: Model<ArtistDocument>,
    @InjectModel(Genre.name) private readonly GenreModel: Model<GenreDocument>,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    try {
      const { genreId, ...ArtistData } = createArtistDto;
      const genre = await this.GenreModel.findById(genreId).exec();
      if (!genre) {
        throw new NotFoundException(`Genre with ID ${genreId} not found`);
      }

      const newArtist = new this.ArtistModel({
        ...ArtistData,
        genre,
      });

      await newArtist.save();
      return newArtist.toObject();
    } catch (error) {
      console.error(error);

      if (error.code === 11000) {
        // Duplicate key error (E11000)
        throw new ConflictException(
          `Artist with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
    }
  }

  async findAll() {
    try {
      return await this.ArtistModel.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.ArtistModel.findById(id);
      return user;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
  }
}
