import {MigrationInterface, QueryRunner} from "typeorm";

export class init1588220132591 implements MigrationInterface {
    name = 'init1588220132591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "name" text NOT NULL, "profile_image_url" text NOT NULL, "authentication_id" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_645fbbd138a754f3f720ef0a2db" UNIQUE ("authentication_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "answer_reaction_type_enum" AS ENUM('LIKE', 'DISLIKE')`, undefined);
        await queryRunner.query(`CREATE TABLE "answer_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "answer_reaction_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_id" uuid, "author_id" uuid, CONSTRAINT "UQ_fe857f10898e55211c5915fb7a2" UNIQUE ("answer_id", "author_id"), CONSTRAINT "PK_b85794d4a4ac59b5a2d5a4c960a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "comment_reaction_type_enum" AS ENUM('LIKE', 'DISLIKE')`, undefined);
        await queryRunner.query(`CREATE TABLE "comment_reaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "comment_reaction_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "comment_id" uuid, "author_id" uuid, CONSTRAINT "UQ_2133b82d95e673a1e1837065ce1" UNIQUE ("comment_id", "author_id"), CONSTRAINT "PK_87f27d282c06eb61b1e0cde2d24" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" text NOT NULL, "likes" integer NOT NULL DEFAULT 0, "dislikes" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_id" uuid, "author_id" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "post_game_type_enum" AS ENUM('CASH', 'TOURNAMENT')`, undefined);
        await queryRunner.query(`CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "body" text NOT NULL, "game_type" "post_game_type_enum" NOT NULL, "player_length" smallint NOT NULL, "player_stack_sizes" double precision array NOT NULL, "player_cards" smallint array NOT NULL, "community_cards" smallint array NOT NULL, "hero_index" smallint NOT NULL, "small_blind_size" double precision NOT NULL, "anti_size" double precision NOT NULL, "preflop_actions" text array NOT NULL, "flop_actions" text array NOT NULL, "turn_actions" text array NOT NULL, "river_actions" text array NOT NULL, "likes" integer NOT NULL DEFAULT 0, "dislikes" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "author_id" uuid, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" text NOT NULL, "likes" integer NOT NULL DEFAULT 0, "dislikes" integer NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "author_id" uuid, "post_id" uuid, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" ADD CONSTRAINT "FK_25efc963286a665e8eb12fd95b1" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" ADD CONSTRAINT "FK_b565387793d2dfdafec1815cd4c" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_reaction" ADD CONSTRAINT "FK_962582f04d3f639e33f43c54bbc" FOREIGN KEY ("comment_id") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_reaction" ADD CONSTRAINT "FK_faea908e72f8770985190148a73" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_1dfbcfedc5867bcc83b4becb044" FOREIGN KEY ("answer_id") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_c3b1e07ce5f147390981f1afe7d" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_6b4c47227c087884847159b6f37" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_6b4c47227c087884847159b6f37"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_c3b1e07ce5f147390981f1afe7d"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_2f1a9ca8908fc8168bc18437f62"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_1dfbcfedc5867bcc83b4becb044"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_reaction" DROP CONSTRAINT "FK_faea908e72f8770985190148a73"`, undefined);
        await queryRunner.query(`ALTER TABLE "comment_reaction" DROP CONSTRAINT "FK_962582f04d3f639e33f43c54bbc"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" DROP CONSTRAINT "FK_b565387793d2dfdafec1815cd4c"`, undefined);
        await queryRunner.query(`ALTER TABLE "answer_reaction" DROP CONSTRAINT "FK_25efc963286a665e8eb12fd95b1"`, undefined);
        await queryRunner.query(`DROP TABLE "answer"`, undefined);
        await queryRunner.query(`DROP TABLE "post"`, undefined);
        await queryRunner.query(`DROP TYPE "post_game_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "comment"`, undefined);
        await queryRunner.query(`DROP TABLE "comment_reaction"`, undefined);
        await queryRunner.query(`DROP TYPE "comment_reaction_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "answer_reaction"`, undefined);
        await queryRunner.query(`DROP TYPE "answer_reaction_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
