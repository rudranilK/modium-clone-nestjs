if(!process.env.IS_TS_NODE){          //In DEV, this will be set! In PROD this will not be set so 'module-alias' package will be used!!
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
