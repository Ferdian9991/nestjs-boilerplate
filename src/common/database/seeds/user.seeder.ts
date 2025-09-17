import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from '@/modules/gate/users/entities/user.entity';
import { RoleEnum } from '@/modules/gate/roles/enums/role.enum';
import { HashHelper } from '@/common/helper/hash.helper';
import { CreateUserDto } from '@/modules/gate/users/dto/create-user.dto';
import { UserRoleEntity } from '@/modules/gate/users/entities/user-roles.entity';
import { RoleEntity } from '@/modules/gate/roles/entities/role.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Insert admin user
    const userRepository = dataSource.getRepository(UserEntity);

    const data: CreateUserDto = {
      username: 'admin',
      fullname: 'Admin Aplikasi',
      email: 'admin@yopmail.com',
      password: await HashHelper.hash('admin1234'),
      is_ctive: true,
    };

    let user = await userRepository.findOneBy({ username: data.username });

    // Insert only one record with this username.
    if (!user) {
      const userCreate = userRepository.create(data);
      user = await userRepository.save(userCreate);
    }

    // Assign role to user
    if (user) {
      await this.assignRoleToUser(dataSource, user, RoleEnum.ADMIN);
    }

    // Get user factory from factory manager.

    const userFactory = factoryManager.get(UserEntity);

    // // Insert many records in database.
    const users = await userFactory.saveMany(40);

    // Assign role to users
    for (const user of users) {
      await this.assignRoleToUser(dataSource, user, RoleEnum.MAHASISWA);
    }
  }

  /**
   * Assign role to user
   *
   * @param {DataSource} dataSource
   * @param {UserEntity} user
   * @returns {Promise<void>}
   */
  private async assignRoleToUser(
    dataSource: DataSource,
    user: UserEntity,
    code: RoleEnum,
  ): Promise<void> {
    // Get role admin
    const roleRepository = dataSource.getRepository(RoleEntity);
    const role = await roleRepository.findOneBy({ code });

    // Get user role repository
    const userRoleRepository = dataSource.getRepository(UserRoleEntity);

    // Check if user already has role admin
    const userRole = await userRoleRepository.findOneBy({
      user_id: user.id,
      role_id: role.id,
    });

    // Assign role admin to user if not exists
    if (!userRole) {
      const userRoleCreate = userRoleRepository.create({
        user_id: user.id,
        role_id: role.id,
      });
      await userRoleRepository.save(userRoleCreate);
    }
  }
}
