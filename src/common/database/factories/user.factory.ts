import { setSeederFactory } from 'typeorm-extension';
import { HashHelper } from '@/common/helper/hash.helper';
import { UserEntity } from '@/modules/gate/users/entities/user.entity';

export default setSeederFactory(UserEntity, async (faker) => {
  const user = new UserEntity();

  user.username = faker.internet.userName();
  user.fullname = faker.person.fullName();
  user.email = faker.internet.email();
  user.password = await HashHelper.hash('12341234');
  user.is_active = true;

  return user;
});
