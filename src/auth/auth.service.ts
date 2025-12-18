import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../lib/prisma/prismaService'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Resend } from 'resend'
import { JwtService } from '@nestjs/jwt'
const resend = new Resend('re_8CKfk229_DdVrgJtpPEXatVghuWSEYWEH')

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService: JwtService) {}

  async register(data) {
    const hashed = await bcrypt.hash(data.password, 10)
    const user = await this.prisma.user.create({
      data: { ...data, password: hashed }
    })
    return { id: user.id, email: user.email, name: user.name }
  }

async login(email, password) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new UnauthorizedException('Invalid credentials')

    const payload = { sub: user.id, email: user.email, role: user.role }

const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' })
const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })


    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }

async sendOtp(email) {
  const user = await this.prisma.user.findUnique({ where: { email } })
  if (!user) throw new BadRequestException('User not found')

  const otp = randomBytes(3).toString('hex')
  const expiry = new Date()
  expiry.setMinutes(expiry.getMinutes() + 3)

  await this.prisma.user.update({
    where: { email },
    data: { otp, otpExpiry: expiry }
  })

  const emailContent = `
    <div style="font-family: sans-serif; text-align: center;">
      <h2>OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #4CAF50;">${otp}</h1>
      <p>This OTP will expire in 3 minutes.</p>
    </div>
  `

  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your OTP Code',
      html: emailContent
    })
    console.log('OTP email sent successfully', response)
    return { message: 'OTP sent successfully', otp }  // <-- include OTP in response
  } catch (error) {
    console.error('Error sending OTP email', error)
    throw new InternalServerErrorException('Failed to send OTP email')
  }
}

  async setPassword(email, otp, newPassword) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || user.otp !== otp) throw new BadRequestException('Invalid OTP')
    if (!user.otpExpiry || user.otpExpiry < new Date()) throw new BadRequestException('OTP expired')
    const hashed = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { email },
      data: { password: hashed, otp: null, otpExpiry: null }
    })
    return { message: 'Password updated' }
  }
}
