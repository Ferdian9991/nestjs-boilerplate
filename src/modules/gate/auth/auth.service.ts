import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import Unauthorized from '@/common/error/unauthorized.error';
import { HashHelper } from '@/common/helper/hash.helper';
import { JwtService } from '@nestjs/jwt';
import ConfigHelper from '@/common/helper/config.helper';
import { GATE_USER_REPOSITORY } from '../users/users.providers';

export type LoginUserType = UserEntity & { accessToken?: string };

@Injectable()
export class AuthService {
  constructor(
    @Inject(GATE_USER_REPOSITORY)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login a user
   *
   * @param {CreateAuthDto} createAuthDto
   * @returns {Promise<LoginUserType>}
   */
  async login(createAuthDto: CreateAuthDto): Promise<LoginUserType> {
    const user: LoginUserType = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      relations: ['roles'],
    });

    const unauthorizedException = new Unauthorized('Invalid email or password');
    if (!user) {
      throw unauthorizedException;
    }

    // Validate password, if not match throw error Unauthorized
    if (!(await HashHelper.compare(createAuthDto.password, user.password))) {
      throw unauthorizedException;
    }

    const unauthorizedRoleException = new Unauthorized(
      `You do not have permission to login as ${createAuthDto.login_as}`,
    );

    // Check if user has the role to login
    if (!this.checkHasRole(user, createAuthDto.login_as)) {
      throw unauthorizedRoleException;
    }

    const role = user.roles.find((r) => r.code === createAuthDto.login_as);

    if (!role) {
      throw unauthorizedRoleException;
    }

    const payload = {
      sub: user.id,
      role_id: role.id,
      role_code: role.code,
    };

    const jwt = await this.jwtService.signAsync(payload, {
      secret: ConfigHelper.get<string>('APP_SECRET'),
      expiresIn: '1d',
    });

    user.accessToken = jwt;
    delete user.password;

    return user;
  }

  /**
   * Validate user role
   *
   * @param {UserEntity} user
   * @param {string} roleCode
   * @returns {boolean}
   */
  private checkHasRole(user: UserEntity, roleCode: string): boolean {
    return user.roles.some((role) => role.code === roleCode);
  }
}
