import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import Unauthorized from '@/common/error/unauthorized.error';
import { HashHelper } from '@/common/helper/hash.helper';
import { JwtService } from '@nestjs/jwt';
import ConfigHelper from '@/common/helper/config.helper';

export type LoginUserType = UserEntity & { accessToken?: string };

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
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
    const user: LoginUserType = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: createAuthDto.email })
      .getOne();

    const unauthorizedException = new Unauthorized('Invalid email or password');
    if (!user) {
      throw unauthorizedException;
    }

    // Validate password, if not match throw error Unauthorized
    if (!(await HashHelper.compare(createAuthDto.password, user.password))) {
      throw unauthorizedException;
    }

    const payload = { sub: user.id };
    const jwt = await this.jwtService.signAsync(payload, {
      secret: ConfigHelper.get<string>('APP_SECRET'),
      expiresIn: '1d',
    });

    user.accessToken = jwt;
    delete user.password;

    return user;
  }
}
