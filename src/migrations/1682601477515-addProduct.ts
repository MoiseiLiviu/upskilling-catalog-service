import { MigrationInterface, QueryRunner } from "typeorm"

export class AddProduct1682601477515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TABLE product (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        units_available INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
        CREATE TABLE product_categories (
        product_id INTEGER REFERENCES product(id),
        category_id INTEGER REFERENCES category(id),
        PRIMARY KEY (product_id, category_id)
);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE product_categories;
        DROP TABLE product;
        `)
    }
}
