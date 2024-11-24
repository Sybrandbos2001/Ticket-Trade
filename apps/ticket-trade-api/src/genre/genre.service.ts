import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
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
      console.error(error);

      if (error.code === 11000) {
        // Duplicate key error (E11000)
        throw new ConflictException(
          `Genre with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
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
      console.error(error.message);
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    try {
      const updatedGenre = await this.GenreModel.findByIdAndUpdate(id, updateGenreDto, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update
      });

      if (!updatedGenre) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
      }
      return updatedGenre.toObject();
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        throw new ConflictException(
          `Genre with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
    }
  }

  async remove(id: string) {
    try {
      const deletedLocation = await this.GenreModel.findByIdAndDelete(id);

      if (!deletedLocation) {
        throw new NotFoundException(`Genre with ID ${id} not found`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
