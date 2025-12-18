import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { Observable } from 'rxjs'

@Injectable()
export class CommentsService {
  private prisma = new PrismaClient()

  async createComment(content: string, authorId: string, taskId: string) {
    return this.prisma.comment.create({
      data: { content, authorId, taskId },
    })
  }

async getCommentsByTask(taskId: string, userId: string) {
  const comments = await this.prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
      authorId: true,
      author: {
        select: { name: true, file: true }
      }
    }
  })

  return comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    own: comment.authorId === userId,
    authorName: comment.author?.name || 'Unknown',
    authorFile: comment.author?.file || ''
  }))
}







  async deleteComment(id: string) {
    return this.prisma.comment.delete({
      where: { id },
    })
  }


async getAllTasksForAdmin() {
  const tasks = await this.prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      project: {
        select: { id: true, name: true }
      },
      assignedUsers: {
        select: { id: true, name: true, email: true }
      },
      comments: {
        select: {
          id: true,
          readBy: {
            select: { id: true }
          }
        }
      },
      createdAt: true,
      updatedAt: true
    }
  })

  return tasks.map(task => ({
    taskId: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    projectId: task.project.id,
    projectName: task.project.name,
    assignedUsers: task.assignedUsers,
    totalComments: task.comments.length,
    unreadCount: task.comments.filter(comment => comment.readBy.length === 0).length,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  }))
}


async getUnreadComments(userId: string) {
  try {
    const tasks = await this.prisma.task.findMany({
      where: {
        assignedUsers: { some: { id: userId } }
      },
      select: {
        id: true,
        title: true,
        dueDate: true,
        comments: {
          where: { readBy: { none: { id: userId } } },
        }
      }
    })

    if (!tasks || tasks.length === 0) {
      return { message: 'No tasks assigned', tasks: [] }
    }

    return tasks.map(task => ({
      taskId: task.id,
      title: task.title,
      dueDate: task.dueDate,
      unreadCount: task.comments.length || 0
    }))
  } catch (error) {
    return { message: 'Error fetching tasks', error: error.message }
  }
}






async markCommentsRead(taskId: string, userId: string) {
  const unreadComments = await this.prisma.comment.findMany({
    where: {
      taskId,
      readBy: { none: { id: userId } }
    }
  })

  for (const comment of unreadComments) {
    await this.prisma.comment.update({
      where: { id: comment.id },
      data: { readBy: { connect: { id: userId } } }
    })
  }

  return { success: true, updated: unreadComments.length }
}

async getTasksByUserId(userId: string) {
  const tasks = await this.prisma.task.findMany({
    where: { assignedUsers: { some: { id: userId } } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      project: { select: { id: true, name: true } },
      comments: {
        select: {
          id: true,
          authorId: true,
          readBy: { select: { id: true } }
        }
      },
      createdAt: true,
      updatedAt: true
    }
  })

  return tasks.map(task => ({
    taskId: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate,
    projectId: task.project.id,
    projectName: task.project.name,
    totalComments: task.comments.length,
    unreadCount: task.comments.filter(
      comment =>
        comment.authorId !== userId &&
        !comment.readBy.some(user => user.id === userId)
    ).length,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  }))
}


}
