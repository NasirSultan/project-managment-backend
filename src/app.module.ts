import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ProjectModule } from './project-setup/project/project.module'
import { TaskModule } from './tasks/task.module'
@Module({
  imports: [UserModule, AuthModule, ProjectModule,TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  