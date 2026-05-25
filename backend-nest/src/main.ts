import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    cookieSession({
      name: 'sly_session',
      keys: [process.env.SESSION_SECRET || 'sly_secret_key_change_me'],
      maxAge: 24 * 60 * 60 * 1000,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
