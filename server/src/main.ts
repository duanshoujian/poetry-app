import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 监听 Railway 注入的 PORT（诗泉后端环境为 8080），railway.json 的 port 与之保持一致
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`诗词鉴赏 API 服务已启动: http://localhost:${port}`);
}
bootstrap();
