import { Injectable } from '@nestjs/common'
import { PrismaService } from '../lib/prisma/prismaService'
import { UpdateUserDto } from './user.dto'
import axios from 'axios'
import FormData from 'form-data'
import { Express } from 'express'


@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

async update(id: string, data: UpdateUserDto & { file?: Express.Multer.File }) {
  const updateData: any = {
    name: data.name,
    organization: data.organization || null,
    phone: data.phone || null,
    role: data.role,
    password: data.password,
    file: null
  }

  if (data.file) {
    const form = new FormData()
    form.append('image', data.file.buffer.toString('base64'))
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    )
    updateData.file = response.data.data.url
  }

  return this.prismaService.user.update({
    where: { id },
    data: updateData
  })
}


async getById(id: string) {
  return this.prismaService.user.findUnique({ where: { id } })
}


  async getAll() {
    return this.prismaService.user.findMany()
  }

  async delete(id: string) {
    return this.prismaService.user.delete({ where: { id } })
  }

  async getAllUsers() {
  return this.prismaService.user.findMany({
    where: { role: 'user' }
  })
}


async getDashboard() {
  const [
    totalUsers,
    totalProjects,
    inProgressProjects,
    totalTasks,
    inProgressTasks,
    totalRequests,
    approvedRequests,
    rejectedRequests
  ] = await Promise.all([
    this.prismaService.user.count(),
    this.prismaService.project.count({ where: { isDeleted: false } }),
    this.prismaService.project.count({ where: { status: 'active', isDeleted: false } }),
    this.prismaService.task.count(),
    this.prismaService.task.count({ where: { status: 'pending', project: { isDeleted: false } } }),
    this.prismaService.task.count({ where: { status: 'approval_requested', project: { isDeleted: false } } }),
    this.prismaService.task.count({ where: { status: 'approved', project: { isDeleted: false } } }),
    this.prismaService.task.count({ where: { status: 'rejected', project: { isDeleted: false } } })
  ])

  return {
    users: { total: totalUsers },
    projects: { total: totalProjects, inProgress: inProgressProjects },
    tasks: { total: totalTasks, inProgress: inProgressTasks },
    requests: {
      total: totalRequests + approvedRequests + rejectedRequests,
      approvalRequested: totalRequests,
      approved: approvedRequests,
      rejected: rejectedRequests
    }
  }
}

async getUserTaskDashboard(userId: string) {
  const [
    totalAssignedTasks,
    pendingTasks,
    approvalRequestedTasks,
    approvedTasks,
    rejectedTasks
  ] = await Promise.all([
    this.prismaService.task.count({
      where: {
        assignedUsers: {
          some: { id: userId }
        }
      }
    }),
    this.prismaService.task.count({
      where: {
        assignedUsers: {
          some: { id: userId }
        },
        status: "pending"
      }
    }),
    this.prismaService.task.count({
      where: {
        assignedUsers: {
          some: { id: userId }
        },
        status: "approval_requested"
      }
    }),
    this.prismaService.task.count({
      where: {
        assignedUsers: {
          some: { id: userId }
        },
        status: "approved"
      }
    }),
    this.prismaService.task.count({
      where: {
        assignedUsers: {
          some: { id: userId }
        },
        status: "rejected"
      }
    })
  ])

  return {
    tasks: {
      totalAssigned: totalAssignedTasks,
      pending: pendingTasks
    },
    requests: {
      total: approvalRequestedTasks + approvedTasks + rejectedTasks,
      approvalRequested: approvalRequestedTasks,
      approved: approvedTasks,
      rejected: rejectedTasks
    }
  }
}



}
