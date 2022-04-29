import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export default class AppSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('apps', ['name'])
      .values([
        { name: 'Whatsapp' },
        { name: 'Gmail' },
        { name: 'Hotmail' },
        { name: 'ProtonMail' },
      ])
      .execute();
  }
}
