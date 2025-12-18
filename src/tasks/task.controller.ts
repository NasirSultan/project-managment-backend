import { Controller, Post,Delete,Get,Req, Put, Body,UseGuards, Param } from '@nestjs/common'
import { TaskService } from './task.service'
import { CreateTaskDto } from './dto/createTaskDto'
import { UpdateTaskDto } from './dto/updateTaskDto'
import { JwtAuthGuard } from './../user/jwt.guard'


@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(id, dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.taskService.deleteTask(id)
  }
@Get()
getAll() {
  return this.taskService.getAllTasks()
}

  @Get(':id/detail')
  getTaskDetail(@Param('id') id: string) {
    return this.taskService.findByIdWithRelations(id)
  }

  @Post(':id/request-approval')
  requestApproval(@Param('id') id: string) {
    return this.taskService.requestApproval(id)
  }

  @Put(':id/approve-or-reject')
  approveOrReject(@Param('id') id: string, @Body() body: { status: 'approved' | 'rejected' }) {
    return this.taskService.setApprovalStatus(id, body.status)
  }

  @Get('approval-requests')
  getApprovalRequests() {
    return this.taskService.getApprovalRequests()
  }


  @UseGuards(JwtAuthGuard)
  @Get('my-tasks')
  getMyTasks(@Req() req) {
    return this.taskService.getTasksAssignedToUser(req.user.id)
  }

}
