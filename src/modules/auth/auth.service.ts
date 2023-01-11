import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      // checar se a senha corresponde a hash do banco
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid){
        return {
          ...user,
          password: undefined,
        }
      }
    }

    // se não encontrar o usuário ou a senha não corresponder.
    throw new UnauthorizedError(
      'Email address or password provided is incorrect.'
    );
  }
}
