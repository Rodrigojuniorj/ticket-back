import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    if (!cpf.isValid(createUserDto.cpf)) {
      throw new Error('CPF inválido');
    }

    const user = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({
      data: user,
    });

    return {
      ...createdUser,
      password: undefined,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.user.findUnique({
      where: { cpf },
    });
  }
}
