import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common'
import { TaskRepository } from './task.repository'
import { CreateTaskDto } from './dto/createTaskDto'
import { UpdateTaskDto } from './dto/updateTaskDto'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class TaskService {
    private prisma = new PrismaClient()

    constructor(private readonly taskRepo: TaskRepository) { }

    async createTask(dto: CreateTaskDto) {
        const project = await this.prisma.project.findUnique({
            where: { id: dto.projectId },
            include: { flows: { include: { screens: true } } }
        })

        if (!project) throw new NotFoundException('Project not found')

        const flows = dto.flowIds?.length ? { connect: dto.flowIds.map(id => ({ id })) } : { connect: project.flows.map(f => ({ id: f.id })) }

        const screens = dto.screenIds?.length
            ? { connect: dto.screenIds.map(id => ({ id })) }
            : { connect: project.flows.flatMap(f => f.screens.map(s => ({ id: s.id }))) }

        const assignedUsers = dto.assignedUserIds?.length
            ? { connect: dto.assignedUserIds.map(id => ({ id })) }
            : undefined

        return this.taskRepo.create({
            title: dto.title,
            description: dto.description,
            status: dto.status || 'pending',
            dueDate: dto.dueDate,
            projectId: dto.projectId,
            flows,
            screens,
            assignedUsers
        })
    }

    async updateTask(id: string, dto: UpdateTaskDto) {
        const task = await this.taskRepo.findById(id)
        if (!task) throw new NotFoundException('Task not found')

        const flows = dto.flowIds ? { set: dto.flowIds.map(id => ({ id })) } : undefined
        const screens = dto.screenIds ? { set: dto.screenIds.map(id => ({ id })) } : undefined
        const assignedUsers = dto.assignedUserIds ? { set: dto.assignedUserIds.map(id => ({ id })) } : undefined

        const project = dto.projectId ? { connect: { id: dto.projectId } } : undefined

        return this.taskRepo.update(id, {
            title: dto.title,
            description: dto.description,
            status: dto.status,
            dueDate: dto.dueDate,
            flows,
            screens,
            assignedUsers,
            project
        })
    }

    async deleteTask(id: string) {
        const task = await this.taskRepo.findById(id)
        if (!task) throw new NotFoundException('Task not found')

        return this.taskRepo.delete(id)
    }

    async getAllTasks() {
        return this.prisma.task.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                dueDate: true,
                project: {
                    select: {
                        name: true
                    }
                },
                assignedUsers: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        file: true
                    }
                }
            }
        })
    }


async findByIdWithRelations(id: string) {
  const taskPromise = this.prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      assignedUsers: { select: { id: true, name: true, email: true ,file:true } },
      projectId: true
    }
  })

  const projectPromise = taskPromise.then(task => {
    if (!task) return null
    return this.prisma.project.findUnique({
      where: { id: task.projectId },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        figmaLink: true,
        documentation: true,
        assignedUsers: { select: { id: true, name: true, email: true } },
        flows: { select: { id: true, name: true } }
      }
    })
  })

  const flowsPromise = taskPromise.then(task => {
    if (!task) return []
    return this.prisma.flow.findMany({
      where: {
        tasks: {
          some: { id: task.id }
        }
      },
      select: {
        id: true,
        name: true,
        screens: { select: { id: true, name: true, description: true } }
      }
    })
  })

  const [task, project, flows] = await Promise.all([taskPromise, projectPromise, flowsPromise])

  if (!task) return null

  return { ...task, project, flows }
}


async requestApproval(id: string) {
  const task = await this.taskRepo.findById(id)
  if (!task) throw new NotFoundException('Task not found')
  if (task.status !== 'pending' && task.status !== 'rejected') 
    throw new BadRequestException('Task cannot request approval')

  return this.taskRepo.update(id, { status: 'approval_requested' })
}


async setApprovalStatus(id: string, status: 'approved' | 'rejected') {
  const task = await this.taskRepo.findById(id)
  if (!task) throw new NotFoundException('Task not found')
  if (task.status !== 'approval_requested') throw new BadRequestException('Task is not awaiting approval')

  return this.taskRepo.update(id, { status })
}


async getApprovalRequests() {
  return this.prisma.task.findMany({
    where: { status: 'approval_requested' },
    select: {
      id: true,
      title: true,
      description: true,
      dueDate: true,
      project: {
        select: { name: true }
      },
      assignedUsers: {
        select: { id: true, name: true, email: true,file:true }
      }
    }
  })
}



async getTasksAssignedToUser(userId: string) {
  return this.prisma.task.findMany({
    where: {
      assignedUsers: {
        some: {
          id: userId
        }
      }
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      project: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          flows: true,
          screens: true
        }
      }
    }
  })
}


}
