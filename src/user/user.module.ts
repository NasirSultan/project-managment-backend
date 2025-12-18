import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { PrismaService } from '../lib/prisma/prismaService'
import { JwtAuthGuard } from './jwt.guard'
import { AuthModule } from '../auth/auth.module'

@Module({

  imports: [AuthModule],
  providers: [UserService, PrismaService,JwtAuthGuard],
  controllers: [UserController]
})
export class UserModule {}
