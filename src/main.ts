import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { initializeApp, credential } from 'firebase-admin';
import { ValidationPipe } from '@nestjs/common';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

async function bootstrap() {
  const buff = Buffer.from(process.env.FIREBASE_CREDENTIAL, 'base64');
  const credentialFireString = buff.toString('ascii');
  const credentialFirebase = JSON.parse(credentialFireString);
  initializeApp({
    credential: credential.cert(credentialFirebase),
    databaseURL: process.env.FIREBASE_DB,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
