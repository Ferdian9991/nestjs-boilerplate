import { Inject, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { ACADEMIC_PERIOD_REPOSITORY } from './periods.providers';
import { PeriodEntity } from './entities/period.entity';
import { Repository } from 'typeorm';
import Validation from '@/common/error/validation.error';
import { PaginationRequestType } from '@/common/decorator/pagination-request.decorator';
import {
  PaginationResponseType,
  QueryHelper,
} from '@/common/helper/query.helper';
import NotFound from '@/common/error/not-found.error';

@Injectable()
export class PeriodsService {
  constructor(
    @Inject(ACADEMIC_PERIOD_REPOSITORY)
    private periodRepository: Repository<PeriodEntity>,
  ) {}

  /**
   * Create a new period
   *
   * @param {CreatePeriodDto} createPeriodDto
   * @returns {Promise<PeriodEntity>}
   */
  async create(createPeriodDto: CreatePeriodDto): Promise<PeriodEntity> {
    const period = this.periodRepository.create(createPeriodDto);

    // Check if period code already exists
    await this.checkPeriodCodeExists(createPeriodDto.code);

    return await this.periodRepository.save(period);
  }

  /**
   * Find all periods
   *
   * @param {PaginationRequestType} params
   * @returns {Promise<PaginationResponseType<PeriodEntity>>}
   */
  findAll(
    params: PaginationRequestType,
  ): Promise<PaginationResponseType<PeriodEntity>> {
    return QueryHelper.paginate({
      repo: this.periodRepository,
      alias: 'period',
      params,
      searchFields: ['code', 'name'],
    });
  }

  /**
   * Find one period by id
   *
   * @param {number} id
   * @returns {Promise<PeriodEntity>}
   */
  async findOne(id: number): Promise<PeriodEntity> {
    const period = await this.periodRepository.findOne({ where: { id } });

    if (!period) {
      throw new NotFound(`Period with id ${id} not found`);
    }

    return period;
  }

  /**
   * Update a period by id
   *
   * @param {number} id
   * @param {UpdatePeriodDto} updatePeriodDto
   * @returns {Promise<PeriodEntity>}
   */
  async update(
    id: number,
    updatePeriodDto: UpdatePeriodDto,
  ): Promise<PeriodEntity> {
    const period = await this.findOne(id);

    if (!period) {
      throw new NotFound(`Period with id ${id} not found`);
    }

    await this.checkPeriodCodeExists(updatePeriodDto.code, id);

    Object.assign(period, updatePeriodDto);

    return await this.periodRepository.save(period);
  }

  /**
   * Remove a period by id
   *
   * @param {number} id
   * @returns {Promise<PeriodEntity>}
   */
  async remove(id: number): Promise<PeriodEntity> {
    const period = await this.findOne(id);

    if (!period) {
      throw new NotFound(`Period with id ${id} not found`);
    }

    return await this.periodRepository.softRemove(period);
  }

  /**
   * Check if period code already exists
   *
   * @param {string} code
   * @param {number} [id]
   * @returns {Promise<void>}
   */
  private async checkPeriodCodeExists(
    code: string,
    id?: number,
  ): Promise<void> {
    const period = await this.periodRepository.findOne({ where: { code } });

    if (period && period.id !== id) {
      throw new Validation(
        JSON.stringify([
          { field: 'code', message: 'Period code already exists' },
        ]),
      );
    }
  }
}
