import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.provider';
import { AuthService } from './auth.service';
import { JwtStategy } from './strategy';
// el modulo me maneja los controladores y servicios

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController], // quien maneja el request
  providers: [...authProviders, AuthService, JwtStategy], // quien hace logica
})
export class AuthModule {}
