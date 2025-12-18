import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { FlowService } from './flow.service'
import { CreateFlowDto } from './dto/createFlowDto'
import { UpdateFlowDto } from './dto/updateFlowDto'

@Controller('projects/:projectId/flows')
export class FlowController {
  constructor(private flowService: FlowService) {}

  @Post()
  async create(@Param('projectId') projectId: string, @Body() dto: CreateFlowDto) {
    return this.flowService.createFlow(projectId, dto)
  }

  @Get()
  async findAll(@Param('projectId') projectId: string) {
    return this.flowService.getFlows(projectId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.flowService.getFlowById(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateFlowDto) {
    return this.flowService.updateFlow(id, dto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.flowService.deleteFlow(id)
  }
}
