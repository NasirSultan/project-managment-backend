import { PrismaClient, Screen } from '@prisma/client'
import { CreateScreenDto } from './dto/createScreenDto'
import { UpdateScreenDto } from './dto/updateScreenDto'

const prisma = new PrismaClient()

export class ScreenRepository {
  async create(data: CreateScreenDto): Promise<Screen> {
    return prisma.screen.create({ data })
  }

  async findAll(): Promise<Screen[]> {
    return prisma.screen.findMany()
  }

  async findById(id: string): Promise<Screen | null> {
    return prisma.screen.findUnique({ where: { id } })
  }

  async update(id: string, data: UpdateScreenDto): Promise<Screen> {
    return prisma.screen.update({ where: { id }, data })
  }

  async delete(id: string): Promise<Screen> {
    return prisma.screen.delete({ where: { id } })
  }
}
