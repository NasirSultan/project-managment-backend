import { Controller, Get, Post, Delete,Sse,Request, Query,Param, Body, UseGuards, Req } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from './../../user/jwt.guard'
import { JwtService } from '@nestjs/jwt'
import { Observable, EMPTY } from 'rxjs'



@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService, private jwtService: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { content: string, taskId: string }, @Req() req) {
    return this.commentsService.createComment(body.content, req.user.id, body.taskId)
  }


// @UseGuards(JwtAuthGuard)
// @Sse('task/:taskId/stream')
// streamByTask(@Param('taskId') taskId: string, @Req() req) {
//   const userId = req.user.id
//   return this.commentsService.streamCommentsByTask(taskId, userId)
// }

  @UseGuards(JwtAuthGuard)
  @Get('task/:taskId')
  async getCommentsByTask(@Param('taskId') taskId: string, @Req() req) {
    const userId = req.user.id
    return this.commentsService.getCommentsByTask(taskId, userId)
  }

  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.commentsService.deleteComment(id)
  }


  @Get('admin/all-tasks')
async getAllTasksAdmin() {
  return this.commentsService.getAllTasksForAdmin()
}


@UseGuards(JwtAuthGuard)
@Get('unread')
async getUnread(@Req() req) {
  return this.commentsService.getUnreadComments(req.user.id)
}


@UseGuards(JwtAuthGuard)
@Post('mark-read/:taskId')
async markRead(@Param('taskId') taskId: string, @Req() req) {
  return this.commentsService.markCommentsRead(taskId, req.user.id)
}

@UseGuards(JwtAuthGuard)
@Get('my-tasks')
async getMyTasks(@Request() req) {
  const userId = req.user.id
  return this.commentsService.getTasksByUserId(userId)
}

}
