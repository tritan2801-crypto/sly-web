import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/sly_clothing';
    
    let dbUrl: URL;
    try {
      dbUrl = new URL(databaseUrl);
    } catch (err) {
      throw new Error(
        `[PRISMA CONFIG ERROR] Biến môi trường DATABASE_URL có giá trị không hợp lệ: "${databaseUrl}". ` +
        `Bạn cần vào Render Dashboard -> Environment, sửa lại DATABASE_URL bằng thông tin thật của bạn, ` +
        `thay thế các từ khóa 'user', 'pass', 'host', 'port' thành tài khoản/địa chỉ kết nối MySQL thực tế.`
      );
    }

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
