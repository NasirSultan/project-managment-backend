import { Controller, Patch, Param, Body,Req, UseInterceptors, UploadedFile, Get, Delete, UseGuards } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import type { Express } from 'express'
import { UserService } from './user.service'
import { UpdateUserDto } from './user.dto'
import { JwtAuthGuard } from './jwt.guard'



@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  update(
    @Req() req,
    @Body() data: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.userService.update(req.user.id, { ...data, file })
  }




  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.getById(req.user.id)
  }

  @Get()
  getAll() {
    return this.userService.getAll()
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Body('userId') userId: string) {
    return this.userService.delete(userId)
  }

  @Get('all-users')
getAllUsers() {
  return this.userService.getAllUsers()
}

@Get('dashboard')
async getDashboard() {
  return this.userService.getDashboard()
}

@UseGuards(JwtAuthGuard)
@Get('task-dashboard')
async getUserTaskDashboard(@Req() req) {
  return this.userService.getUserTaskDashboard(req.user.id)
}


}
