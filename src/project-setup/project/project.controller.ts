import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common'
import { ProjectService } from './project.service'
import { CreateProjectDto } from './dto/createProjectDto'
import { UpdateProjectDto } from './dto/updateProjectDto'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateProjectDto) {
    const userId = req.user?.id || '4177d226-0ff0-482b-bf08-875c43f8946a'
    return await this.projectService.createProject(userId, dto)
  }

  @Get()
  async findAll() {
    return await this.projectService.getAllProjects()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.getProjectById(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return await this.projectService.updateProject(id, dto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectService.deleteProject(id)
  }
}
