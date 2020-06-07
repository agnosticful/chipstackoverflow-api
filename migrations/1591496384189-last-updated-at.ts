import {MigrationInterface, QueryRunner} from "typeorm";

export class lastUpdatedAt1591496384189 implements MigrationInterface {
    name = 'lastUpdatedAt1591496384189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "updated_at" TO "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "updated_at" TO "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "updated_at" TO "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" RENAME COLUMN "updated_at" TO "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" ADD "last_updated_at" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_reaction" ADD "last_updated_at" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_reaction" DROP COLUMN "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" DROP COLUMN "last_updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" RENAME COLUMN "last_updated_at" TO "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "last_updated_at" TO "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "last_updated_at" TO "updated_at"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "last_updated_at" TO "updated_at"`, undefined);
    }

}
