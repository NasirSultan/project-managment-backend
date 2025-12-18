import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaClient, Project } from '@prisma/client'

@Injectable()
export class ProjectRepository {
  private prisma = new PrismaClient()

  async create(data: any): Promise<Project> {
    try {
      return await this.prisma.project.create({ data })
    } catch (error) {
      throw new InternalServerErrorException('Error creating project')
    }
  }

  async findAll(): Promise<Project[]> {
    try {
      return await this.prisma.project.findMany({
        where: { isDeleted: false },
      })
    } catch (error) {
      throw new InternalServerErrorException('Error fetching projects')
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      return await this.prisma.project.findFirst({
        where: { id, isDeleted: false },
      })
    } catch (error) {
      throw new InternalServerErrorException('Error fetching project')
    }
  }

  async update(id: string, data: any): Promise<Project> {
    try {
      return await this.prisma.project.update({
        where: { id },
        data,
      })
    } catch (error) {
      throw new InternalServerErrorException('Error updating project')
    }
  }

  async softDelete(id: string): Promise<Project> {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: { isDeleted: true },
      })
    } catch (error) {
      throw new InternalServerErrorException('Error deleting project')
    }
  }
}
