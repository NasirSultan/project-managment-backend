import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class TaskRepository {
  private prisma = new PrismaClient()

  async create(data: any) {
    return this.prisma.task.create({ data })
  }

  async update(id: string, data: any) {
    return this.prisma.task.update({ where: { id }, data })
  }

  async findById(id: string) {
    return this.prisma.task.findUnique({ where: { id }, include: { flows: true, screens: true, assignedUsers: true } })
  }

   async delete(id: string) {
    return this.prisma.task.delete({ where: { id } })
  }

async getAllTasks() {
  return this.prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      projectId: true
    }
  })
}



}
