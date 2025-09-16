import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1758028315730 implements MigrationInterface {
  name = 'CreateUsersTable1758028315730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gate"."users" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "fullname" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    // Create index on username
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_username" ON "gate"."users" ("username")`,
    );

    // Create index on email
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_email" ON "gate"."users" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "gate"."users"`);
  }
}
