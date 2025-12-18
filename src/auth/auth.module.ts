import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from '../lib/prisma/prismaService'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // change to env variable
       signOptions: { expiresIn: '1h' },
    }),
],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
   exports: [JwtModule], 
})
export class AuthModule {}
