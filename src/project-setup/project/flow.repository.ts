import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateFlowDto } from './dto/createFlowDto'
import { UpdateFlowDto } from './dto/updateFlowDto'

@Injectable()
export class FlowRepository {
  private prisma = new PrismaClient()

  async create(projectId: string, data: CreateFlowDto) {
    return this.prisma.flow.create({
      data: {
        ...data,
        projectId,
      },
    })
  }

  async findAll(projectId: string) {
    return this.prisma.flow.findMany({
      where: { projectId },
      include: { tasks: true, screens: true },
    })
  }

  async findById(id: string) {
    return this.prisma.flow.findUnique({
      where: { id },
      include: { tasks: true, screens: true },
    })
  }

  async update(id: string, data: UpdateFlowDto) {
    return this.prisma.flow.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return this.prisma.flow.delete({
      where: { id },
    })
  }
}
