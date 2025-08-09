import { MigrationInterface, QueryRunner } from "typeorm";

export class Tasktable1754741409506 implements MigrationInterface {
    name = 'Tasktable1754741409506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('TO_DO', 'IN_PROGRESS', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" varying(64) NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "status" "public"."task_status_enum" NOT NULL DEFAULT 'TO_DO', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
    }

}
