import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RoomService {
  constructor(private prisma: DatabaseService) {}

  async create(data: Prisma.RoomCreateInput) {
    return this.prisma.room.create({ data });
  }

  async findByPlace() {
    return this.prisma.room.findMany({
      include: {
        place: true,
      },
    });
  }

  async findAtAll() {
    return this.prisma.room.findMany();
  }

  async findOne(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        place: true,
      },
    });
  }

  async update(id: string, data: Prisma.RoomUpdateInput) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.room.delete({
      where: { id },
    });
  }
}
