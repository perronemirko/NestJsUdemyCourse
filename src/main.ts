import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import { Logger } from '@nestjs/common';
import * as config from 'config'; // in the root folder not src

async function bootstrap() {
  
  const logger = new Logger("bootstrap");
  
  const privateKey = fs.readFileSync('./src/ssl/private.key', 'utf8');
  const certificate = fs.readFileSync('./src/ssl/certificate.crt', 'utf8');
  const httpsOptions = {key: privateKey, cert: certificate};
  
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  if (process.env.NODE_ENV === 'development'){
    app.enableCors();
  }
  await app.init();

  //http.createServer(server).listen(80);
  https.createServer(httpsOptions, server).listen(3000);
}

bootstrap();