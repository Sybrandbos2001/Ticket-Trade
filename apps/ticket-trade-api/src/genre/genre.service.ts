import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly GenreModel: Model<GenreDocument>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      const newGenre = new this.GenreModel(createGenreDto);
      await newGenre.save();
      return newGenre.toObject();
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error (E11000)
        throw new ConflictException(
          `Genre with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.GenreModel.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.GenreModel.findById(id);
      return user;
    } catch (error) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
  }
}
