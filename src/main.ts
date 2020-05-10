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
  var cors = require('cors');
  const logger = new Logger("bootstrap");
  
  let privateKey = fs.readFileSync('./src/ssl/private.key', 'utf8');
  let certificate = fs.readFileSync('./src/ssl/certificate.crt', 'utf8');
  let httpsOptions = {key: privateKey, cert: certificate};
  
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  

  if (process.env.NODE_ENV === 'development'){
    logger.log("development")
    privateKey = fs.readFileSync('./src/ssl/test.key', 'utf8');
    certificate = fs.readFileSync('./src/ssl/test.crt', 'utf8');
    httpsOptions = {key: privateKey, cert: certificate};
    // logger.log("privateKey => " + privateKey)
    // logger.log("certificate => " + certificate)
    // logger.log("httpsOptions key => " + httpsOptions.key)
    // logger.log("httpsOptions cert => " + httpsOptions.cert)
    app.enableCors();
    await app.init();
    https.createServer(httpsOptions, server).listen(3000);
  }
  logger.log("production")
  app.use(cors());
  app.enableCors();
  await app.init();
  
  http.createServer(server).listen(4300);
  https.createServer(httpsOptions, server).listen(3000);
}

bootstrap();