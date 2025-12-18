import { Module } from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskController } from './task.controller'
import { TaskRepository } from './task.repository'
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './../auth/auth.module'

@Module({
  
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  imports: [CommentsModule,AuthModule]
})
export class TaskModule {}
