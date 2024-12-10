import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@ticket-trade/domain';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Genre } from './entities/genre.entity';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create Genre' })
  @ApiResponse({ status: 201, description: 'Genre created successfully', type: Genre })
  async create(@Body() createGenreDto: CreateGenreDto) : Promise<object> {
    const newGenre = await this.genreService.create(createGenreDto);
    return {
      message: 'Genre created successfully',
      genre: newGenre,
    };
  }

  @ApiOperation({ summary: 'Retrieve all genres' })
  @ApiResponse({ status: 200, description: 'List of all genres', type: [Genre] })
  @Get()
  async findAll() {
    return await this.genreService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve single genre by ID' })
  @ApiResponse({ status: 200, description: 'Single genre by ID', type: Genre })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update genre' })
  @ApiResponse({ status: 201, description: 'genre updated successfully', type: Genre })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGenreDto: UpdateGenreDto) : Promise<object> {
    const updatedGenre = await this.genreService.update(id, updateGenreDto);
    return {
      message: 'Genre updated successfully',
      genre: updatedGenre,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete genre' })
  @ApiResponse({ status: 201, description: 'Genre deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<object> {
    await this.genreService.remove(id);
    return {
      message: 'Genre deleted successfully',
    };
  }
}
