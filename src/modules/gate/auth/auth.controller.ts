import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { IsGlobalAccess } from '@/common/decorator/is-global-access.decorator';
import { UserEntity } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login a user
   *
   * @param {CreateAuthDto} createAuthDto
   * @returns {Promise<UserEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Create User'] })
  @ResponseMessage('User created successfully')
  @IsGlobalAccess()
  login(@Body() createAuthDto: CreateAuthDto): Promise<UserEntity> {
    return this.authService.login(createAuthDto);
  }
}
