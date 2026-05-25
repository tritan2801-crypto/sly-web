import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import cookieSession from 'cookie-session';

const server = express();

export const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.use(
    cookieSession({
      name: 'sly_session',
      keys: [process.env.SESSION_SECRET || 'sly_secret_key_change_me'],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );
  
  await app.init();
  return server;
};

export default async (req: any, res: any) => {
  const appServer = await bootstrap();
  appServer(req, res);
};
