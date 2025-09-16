import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGateSchemaMigration1758049272654
  implements MigrationInterface
{
  name = 'CreateGateSchemaMigration1758049272654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create schema if it doesn't exist
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "gate"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop schema if it exists
    await queryRunner.query(`DROP SCHEMA IF EXISTS "gate" CASCADE`);
  }
}
