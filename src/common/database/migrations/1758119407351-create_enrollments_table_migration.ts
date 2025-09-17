import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEnrollmentsTableMigration1758119407351
  implements MigrationInterface
{
  name = 'CreateEnrollmentsTableMigration1758119407351';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        schema: 'academic',
        name: 'enrollments',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'student_id',
            type: 'bigint',
            isNullable: false,
            unsigned: true,
          },
          {
            name: 'classroom_id',
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

    // Add foreign key for classroom_id to classrooms table
    await queryRunner.createForeignKey(
      'academic.enrollments',
      new TableForeignKey({
        columnNames: ['classroom_id'],
        referencedSchema: 'academic',
        referencedTableName: 'classrooms',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Add foreign key for student_id to users table
    await queryRunner.createForeignKey(
      'academic.enrollments',
      new TableForeignKey({
        columnNames: ['student_id'],
        referencedSchema: 'gate',
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_enrollment_student_classroom_unique" ON "academic"."enrollments" ("student_id", "classroom_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "academic"."IDX_enrollment_student_classroom_unique"`,
    );
    const table = await queryRunner.getTable('academic.enrollments');
    const foreignKeyClassroom = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('classroom_id') !== -1,
    );
    if (foreignKeyClassroom) {
      await queryRunner.dropForeignKey(
        'academic.enrollments',
        foreignKeyClassroom,
      );
    }
    const foreignKeyStudent = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('student_id') !== -1,
    );
    if (foreignKeyStudent) {
      await queryRunner.dropForeignKey(
        'academic.enrollments',
        foreignKeyStudent,
      );
    }
    await queryRunner.dropTable('academic.enrollments');
  }
}
