import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGateSchema1758028315710 implements MigrationInterface {
  name = 'CreateGateSchema1758028315710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create gate schema if not exists
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "gate"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS "gate" CASCADE`);
  }
}
