import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ProjectRepository } from './project.repository'
import { CreateProjectDto } from './dto/createProjectDto'
import { UpdateProjectDto } from './dto/updateProjectDto'

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async createProject(userId: string, dto: CreateProjectDto) {
    try {
      const data = { ...dto, createdById: userId }
      return await this.projectRepo.create(data)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getAllProjects() {
    return await this.projectRepo.findAll()
  }

  async getProjectById(id: string) {
    const project = await this.projectRepo.findById(id)
    if (!project) throw new NotFoundException('Project not found')
    return project
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    const project = await this.projectRepo.findById(id)
    if (!project) throw new NotFoundException('Project not found')
    return await this.projectRepo.update(id, dto)
  }

  async deleteProject(id: string) {
    const project = await this.projectRepo.findById(id)
    if (!project) throw new NotFoundException('Project not found')
    return await this.projectRepo.softDelete(id)
  }
}
