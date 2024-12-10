import { Controller, Request, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { Roles } from '../auth/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { IAuthRequest, Role } from '@ticket-trade/domain';
import { Concert } from './entities/concert.entity';

@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create concert' })
  @ApiResponse({ status: 201, description: 'concert created successfully', type: Concert })
  async create(@Body() createconcertDto: CreateConcertDto) : Promise<object> {
    const newconcert = await this.concertService.create(createconcertDto);
    return {
      message: 'Concert created successfully',
      concert: newconcert,
    };
  }

  @ApiOperation({ summary: 'Retrieve all concerts' })
  @ApiResponse({ status: 200, description: 'List of all concerts', type: [Concert] })
  @Get()
  async findAll() {
    return await this.concertService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve single concert by ID' })
  @ApiResponse({ status: 200, description: 'Single concert by ID', type: Concert })
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.concertService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update Concert' })
  @ApiResponse({ status: 201, description: 'Concert updated successfully', type: Concert })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateconcertDto: UpdateConcertDto) : Promise<object> {
    const updatedconcert = await this.concertService.update(id, updateconcertDto);
    return {
      message: 'Concert updated successfully',
      concert: updatedconcert,
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete concert' })
  @ApiResponse({ status: 201, description: 'Concert deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<object> {
    await this.concertService.remove(id);
    return {
      message: 'Concert deleted successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @Get('recommendation')
  @ApiOperation({ summary: 'Get recommendations for concerts to attend to' })
  @ApiResponse({ status: 200, description: 'User concert recommendations' })
  async getConcertRecommendations(@Request() req: IAuthRequest): Promise<object> {
    return await this.concertService.getConcertRecommendations(req.user.sub);
  }
}
