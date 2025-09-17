import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateUserRolesTableMigration1758082114492
  implements MigrationInterface
{
  name = 'CreateUserRolesTableMigration1758082114492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'gate',
        name: 'user_roles',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'role_id',
            type: 'bigint',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'user_id',
            type: 'bigint',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    // Add composite unique constraint
    await queryRunner.createUniqueConstraint(
      'gate.user_roles',
      new TableUnique({
        name: 'UQ_user_roles_user_id_role_id',
        columnNames: ['user_id', 'role_id'],
      }),
    );

    // Add foreign key for user_id
    await queryRunner.createForeignKey(
      'gate.user_roles',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedSchema: 'gate',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for role_id
    await queryRunner.createForeignKey(
      'gate.user_roles',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedSchema: 'gate',
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('gate.user_roles');
  }
}
