import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateQuestionsTable1649861034804 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'feedback_positive',
            type: 'int',
          },
          {
            name: 'feedback_negative',
            type: 'int',
          },
          {
            name: 'wrong_answer',
            type: 'varchar',
          },
          {
            name: 'correct_answer',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'json',
          },
          {
            name: 'app_id',
            type: 'int',
          },
          {
            name: 'message_type_id',
            type: 'int',
          },
          {
            name: 'field_of_work_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['app_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'apps',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['message_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'message_types',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'questions',
      new TableForeignKey({
        columnNames: ['field_of_work_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'fields_of_work',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('questions');
    const appForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('app_id') !== -1,
    );
    const messageTypeForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('message_type_id') !== -1,
    );
    const fieldOfWorkForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('field_of_work_id') !== -1,
    );

    await queryRunner.dropForeignKey('questions', appForeignKey);
    await queryRunner.dropForeignKey('questions', messageTypeForeignKey);
    await queryRunner.dropForeignKey('questions', fieldOfWorkForeignKey);
    await queryRunner.dropTable('questions');
  }
}
