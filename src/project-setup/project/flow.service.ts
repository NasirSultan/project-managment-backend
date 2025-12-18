import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { FlowRepository } from './flow.repository'
import { CreateFlowDto } from './dto/createFlowDto'
import { UpdateFlowDto } from './dto/updateFlowDto'

@Injectable()
export class FlowService {
  constructor(private flowRepo: FlowRepository) {}

  async createFlow(projectId: string, dto: CreateFlowDto) {
    try {
      return await this.flowRepo.create(projectId, dto)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getFlows(projectId: string) {
    return await this.flowRepo.findAll(projectId)
  }

  async getFlowById(id: string) {
    const flow = await this.flowRepo.findById(id)
    if (!flow) throw new NotFoundException('Flow not found')
    return flow
  }

  async updateFlow(id: string, dto: UpdateFlowDto) {
    const flow = await this.flowRepo.findById(id)
    if (!flow) throw new NotFoundException('Flow not found')
    return await this.flowRepo.update(id, dto)
  }

  async deleteFlow(id: string) {
    const flow = await this.flowRepo.findById(id)
    if (!flow) throw new NotFoundException('Flow not found')
    return await this.flowRepo.delete(id)
  }
}
