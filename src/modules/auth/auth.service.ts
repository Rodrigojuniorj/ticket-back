import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '../user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    // Transforma o user em um JWT
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      cpf: user.cpf,
      name: user.name,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser(cpf: string, password: string) {
    const user = await this.userService.findByCpf(cpf);

    if (user) {
      // checar se a senha corresponde a hash do banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    // se não encontrar o usuário ou a senha não corresponder.
    throw new UnauthorizedError('Cpf informado está incorreto.');
  }
}
