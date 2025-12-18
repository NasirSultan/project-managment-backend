import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { CreateScreenDto } from './dto/createScreenDto'

@Injectable()
export class ScreenService {
  constructor(private prisma: PrismaClient) {}

  create(data: CreateScreenDto) {
    return this.prisma.screen.create({ data })
  }

  createMultiple(screens: Omit<CreateScreenDto, 'flowId'>[], flowId: string) {
    const data = screens.map(screen => ({ ...screen, flowId }))
    return this.prisma.screen.createMany({ data, skipDuplicates: true })
  }

  getAll() {
    return this.prisma.screen.findMany()
  }

  getById(id: string) {
    return this.prisma.screen.findUnique({ where: { id } })
  }

  update(id: string, data: Partial<CreateScreenDto>) {
    return this.prisma.screen.update({ where: { id }, data })
  }

  delete(id: string) {
    return this.prisma.screen.delete({ where: { id } })
  }

getByFlow(flowId: string) {
  return this.prisma.screen.findMany({
    where: { flowId }
  })
}


  getProjectWithFlows(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        flows: true
      }
    })
  }
  getFlowWithScreens(flowId: string) {
    return this.prisma.flow.findUnique({
      where: { id: flowId },
      include: {
        screens: true
      }
    })
  }

}
