import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@ticket-trade/domain';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Location } from './entities/location.entity';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({ status: 201, description: 'Location created successfully', type: Location })
  async create(@Body() createLocationDto: CreateLocationDto) : Promise<object> {
    const newLocation = await this.locationService.create(createLocationDto);
    return {
      message: 'Location created successfully',
      location: newLocation,
    };
  }

  @ApiOperation({ summary: 'Retrieve all locations' })
  @ApiResponse({ status: 200, description: 'List of all locations', type: [Location] })
  @Get()
  async findAll() {
    return await this.locationService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve single location by ID' })
  @ApiResponse({ status: 200, description: 'Single location by ID', type: Location })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }
}
