import { setSeederFactory } from 'typeorm-extension';
import { PeriodEntity } from '@/modules/academic/periods/entities/period.entity';

export default setSeederFactory(PeriodEntity, async (faker) => {
  const period = new PeriodEntity();

  period.code = `${faker.number.int({ min: 2020, max: 2024 })}${faker.number.int(
    { min: 1, max: 2 },
  )}`;
  period.name = `Periode ${period.code}`;

  return period;
});
