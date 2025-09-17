import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import NumberId from '@/common/decorator/number-id.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { AuthorizeRole } from '@/common/decorator/authorize-role.decorator';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { PeriodEntity } from './entities/period.entity';
import PaginationRequest, {
  PaginationRequestType,
} from '@/common/decorator/pagination-request.decorator';
import { PaginationResponseType } from '@/common/helper/query.helper';

@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  /**
   * Create a new period
   *
   * @param {CreatePeriodDto} createPeriodDto
   * @returns {Promise<PeriodEntity>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ tags: ['Create Period'] })
  @ResponseMessage('Period created successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  create(@Body() createPeriodDto: CreatePeriodDto): Promise<PeriodEntity> {
    return this.periodsService.create(createPeriodDto);
  }

  /**
   * Get all periods
   *
   * @param {PaginationRequestType} pagination
   * @returns {Promise<PaginationResponseType<PeriodEntity>>}
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['List Period'] })
  @ResponseMessage('Period list fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findAll(
    @PaginationRequest() pagination: PaginationRequestType,
  ): Promise<PaginationResponseType<PeriodEntity>> {
    return this.periodsService.findAll(pagination);
  }

  /**
   * Get one period by id
   *
   * @param {string} id
   * @returns {Promise<PeriodEntity>}
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Get Period'] })
  @ResponseMessage('Period fetched successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  findOne(@NumberId('id') id: string): Promise<PeriodEntity> {
    return this.periodsService.findOne(+id);
  }

  /**
   * Update a period by id
   *
   * @param {string} id
   * @param {UpdatePeriodDto} updatePeriodDto
   * @returns {Promise<PeriodEntity>}
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ tags: ['Update Period'] })
  @ResponseMessage('Period updated successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  update(
    @NumberId('id') id: string,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ): Promise<PeriodEntity> {
    return this.periodsService.update(+id, updatePeriodDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ tags: ['Delete Period'] })
  @ResponseMessage('Period deleted successfully')
  @AuthorizeRole([RoleEnum.ADMIN])
  remove(@NumberId('id') id: string): Promise<PeriodEntity> {
    return this.periodsService.remove(+id);
  }
}
