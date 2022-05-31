import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
@Global() // Con este decorador le digo que el modulo y lo del modulo puede ser usado donde sea
//Normalmente para permitir queun modulo se use en otro lado usamos exports
@Module({
    providers:[PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
