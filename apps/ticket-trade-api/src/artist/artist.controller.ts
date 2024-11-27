import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
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

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Retrieve all Artists' })
  @ApiResponse({ status: 200, description: 'List of all Artists', type: [Artist] })
  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Retrieve single Artist by ID' })
  @ApiResponse({ status: 200, description: 'Single Artist by ID', type: Artist })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update Artist' })
  @ApiResponse({ status: 201, description: 'Artist updated successfully', type: Artist })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) : Promise<object> {
    const updatedArtist = await this.artistService.update(id, updateArtistDto);
    return {
      message: 'Artist updated successfully',
      Artist: updatedArtist,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete Artist' })
  @ApiResponse({ status: 201, description: 'Artist deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<object> {
    await this.artistService.remove(id);
    return {
      message: 'Artist deleted successfully',
    };
  }
}
