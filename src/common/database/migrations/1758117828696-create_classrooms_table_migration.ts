import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateClassroomsTableMigration1758117828696
  implements MigrationInterface
{
  name = 'CreateClassroomsTableMigration1758117828696';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'academic',
        name: 'classrooms',
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
          },
          {
            name: 'day',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'start_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'time',
            isNullable: false,
          },
          {
            name: 'quota',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'participants_count',
            type: 'int',
            isNullable: false,
            default: 0,
          },
          {
            name: 'course_id',
            type: 'bigint',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'period_id',
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

    // Create unique index on "code", "course_id", "period_id" column
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_code_course_period" ON "academic"."classrooms" ("code", "course_id", "period_id") WHERE deleted_at IS NULL`,
    );

    // Add foreign key for course_id
    await queryRunner.createForeignKey(
      'academic.classrooms',
      new TableForeignKey({
        columnNames: ['course_id'],
        referencedSchema: 'academic',
        referencedTableName: 'courses',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for period_id
    await queryRunner.createForeignKey(
      'academic.classrooms',
      new TableForeignKey({
        columnNames: ['period_id'],
        referencedSchema: 'academic',
        referencedTableName: 'periods',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "academic"."classrooms" DROP CONSTRAINT "UQ_course_period"`,
    );

    await queryRunner.dropTable('academic.classrooms');
  }
}
