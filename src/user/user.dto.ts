export class CreateUserDto {
  name: string
  email: string
}

export class UpdateUserDto {
  name?: string
  email?: string
  organization?: string
  phone?: string
  role?: string
  password?: string
  otp?: string
  otpExpiry?: Date
}
