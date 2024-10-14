import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Create a Room
  @Post()
  create(@Body() data: Prisma.RoomCreateInput) {
    return this.roomService.create(data);
  }

  // Get all Rooms
  @Get()
  findAll() {
    return this.roomService.findAtAll();
  }

  // Get a Room by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  // Update a Room by ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.RoomUpdateInput) {
    return this.roomService.update(id, data);
  }

  // Delete a Room by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}
