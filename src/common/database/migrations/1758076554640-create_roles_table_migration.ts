import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRolesTableMigration1758076554640
  implements MigrationInterface
{
  name = 'CreateRolesTableMigration1758076554640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'gate',
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
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

    await queryRunner.createIndex(
      'gate.roles',
      new TableIndex({
        name: 'IDX_role_code_with_unique',
        columnNames: ['code'],
        isUnique: true,
      }),
    );

    // Insert default roles
    await queryRunner.query(
      `INSERT INTO gate.roles (code, name) VALUES 
      ('admin', 'Administrator'), 
      ('mhs', 'Mahasiswa')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('gate.roles', 'IDX_role_code_with_unique');
    await queryRunner.dropTable('gate.roles');
  }
}
