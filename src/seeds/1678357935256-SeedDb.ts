import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1678357935256 implements MigrationInterface {
    name = 'SeedDb1678357935256';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO tags (name) VALUES ('dragons'), ('brooms'), ('magic wands'), ('coffee'), ('express.js');`,
        );

        await queryRunner.query(
            `INSERT INTO users (username, email, password) VALUES ('John','john@john.john','$2b$10$7GDF0id0TMBGUEmrt5whL.bE6yljjkYaDB3hX1nlCld/LD0boFIQK'), ('Jim','jim@garrier.jim','$2b$10$BVPyrqDhjSl8XDj6.9q2nuOJqyU6G8XR7iwi4LOBaLQT7WHN1aBpm');`,
        );

        await queryRunner.query(
            `INSERT INTO articles (slug, title, description, body, "tagList", "authorId" ) VALUES ('first-article','First Article','First Article Description', 'First Article Body', 'coffee,dragons', 1), ('second-article','Second Article','Second Article Description', 'Second Article Body', 'express.js,dragons', 1), ('forth-article','Fourth Article','Fourth Article Description', 'Fourth Article Body', 'brooms,dragons', 2), ('fifth-article','Fifth Article','Fifth Article Description', 'Fifth Article Body', 'express.js,brooms', 2);`,
        );
    }

    public async down(): Promise<void> {}
}
