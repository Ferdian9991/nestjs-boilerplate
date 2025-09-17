import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCoursesTableMigration1758117578234
  implements MigrationInterface
{
  name = 'CreateCoursesTableMigration1758117578234';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'academic',
        name: 'courses',
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
            name: 'credits',
            type: 'int',
            isNullable: false,
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

    // Make index on code column
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_course_code_with_unique" ON "academic"."courses" ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "academic"."IDX_course_code_with_unique"`,
    );
    await queryRunner.dropTable('academic.courses');
  }
}
