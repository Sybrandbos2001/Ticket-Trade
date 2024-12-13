import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Location, LocationDocument } from './entities/location.entity';
import { Model } from 'mongoose';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<LocationDocument>,
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    try {
      const newLocation = new this.locationModel(createLocationDto);
      await newLocation.save();
      return newLocation.toObject();
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        // Duplicate key error (E11000)
        throw new ConflictException(
          `Location with the same ${Object.keys(error.keyValue)[0]} already exists`
        );
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.locationModel.find();
    } catch (error) {
      console.error(error);
    }
  }

  async findOne(id: string) {
    try {
      const location = await this.locationModel.findById(id);
      return location;
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
  }
}
