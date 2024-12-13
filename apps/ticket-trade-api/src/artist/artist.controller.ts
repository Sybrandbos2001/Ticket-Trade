import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Roles } from '../auth/roles.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '@ticket-trade/domain';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create Artist' })
  @ApiResponse({ status: 201, description: 'Artist created successfully', type: Artist })
  async create(@Body() createArtistDto: CreateArtistDto) : Promise<object> {
    console.log("CREATE ARTIST CONTROLLER");
    const newArtist = await this.artistService.create(createArtistDto);
    return {
      message: 'Artist created successfully',
      Artist: newArtist,
    };
  }

  @ApiOperation({ summary: 'Retrieve all Artists' })
  @ApiResponse({ status: 200, description: 'List of all Artists', type: [Artist] })
  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve single Artist by ID' })
  @ApiResponse({ status: 200, description: 'Single Artist by ID', type: Artist })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }
}
