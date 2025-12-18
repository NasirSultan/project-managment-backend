import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { SetPasswordDto } from './dto/set-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @Post('reset-password')
  sendOtp(@Body() body: ResetPasswordDto) {
    return this.authService.sendOtp(body.email)
  }

  @Post('set-password')
  setPassword(@Body() body: SetPasswordDto) {
    return this.authService.setPassword(body.email, body.otp, body.newPassword)
  }
}
