import { Module } from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectController } from './project.controller'
import { ProjectRepository } from './project.repository'
import { FlowService } from './flow.service'
import { FlowController } from './flow.controller'
import { FlowRepository } from './flow.repository'
import { ScreenService } from './screen.service'
import { ScreenController } from './screen.controller'
import { ScreenRepository } from './screen.repository'
import { PrismaClient } from '@prisma/client'


@Module({
  controllers: [ProjectController, FlowController, ScreenController],
  providers: [ProjectService, ProjectRepository, FlowService, FlowRepository, ScreenService, ScreenRepository,{
      provide: PrismaClient,
      useValue: new PrismaClient()
    }],
})
export class ProjectModule {}
