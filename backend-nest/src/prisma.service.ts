import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/sly_clothing';
    
    const dbUrl = new URL(databaseUrl);
    const host = dbUrl.hostname || '127.0.0.1';
    const port = dbUrl.port ? Number(dbUrl.port) : 3306;
    const user = dbUrl.username || 'root';
    const password = dbUrl.password ? decodeURIComponent(dbUrl.password) : '';
    const database = dbUrl.pathname.startsWith('/') ? dbUrl.pathname.substring(1) : dbUrl.pathname;

    const adapter = new PrismaMariaDb({
      host,
      port,
      user,
      password,
      database,
      connectionLimit: 10,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
