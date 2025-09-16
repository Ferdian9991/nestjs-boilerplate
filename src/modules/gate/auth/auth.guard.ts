import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import Unauthorized from '@/common/error/unauthorized.error';
import ConfigHelper from '@/common/helper/config.helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Guard to check if the user is authenticated
   *
   * @param {ExecutionContext} context
   * @returns {Promise<boolean>}
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isGlobalAccess = this.reflector.get<string>(
      'is_global_access',
      context.getHandler(),
    );

    if (isGlobalAccess) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');

    const invalidCredentialsException = new Unauthorized(
      'Invalid credentials provided',
    );

    try {
      req.user = this.jwtService.verify(token, {
        secret: ConfigHelper.get<string>('APP_SECRET'),
      });

      //   Check if user exists
      const user = await this.userRepository.findOneBy({ id: req.user.sub });
      if (!user) {
        throw invalidCredentialsException;
      }

      return true;
    } catch {
      throw invalidCredentialsException;
    }
  }
}
