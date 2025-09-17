import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAcademicSchemaMigration1758117578219
  implements MigrationInterface
{
  name = 'CreateAcademicSchemaMigration1758117578219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'academic' schema if it doesn't exist
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS academic`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'academic' schema
    await queryRunner.query(`DROP SCHEMA IF EXISTS academic CASCADE`);
  }
}
