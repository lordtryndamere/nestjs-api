import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

//Aaqui manejo la logica de negocio
// al decirle que es injectable, le indico que no es necesario instanciar en donde se use
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const ifExists = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (ifExists) throw new ForbiddenException('Credentials taken');
      const user = await this.prisma.user.create({
        data: { email: dto.email, hash },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (!user) throw new ForbiddenException('Credentials incorrect');
      const pwMatches = await argon.verify(user.hash, dto.password);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  //TODO: SEPARAR ESTA LOGICA A UN MODULO APARTE
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return {
      accessToken: token,
    };
  }
}
