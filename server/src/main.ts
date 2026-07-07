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

  // 全链路固定 3000：应用监听、Dockerfile EXPOSE、railway.json port 三者一致，
  // 不依赖 Railway 动态注入的 PORT（该值与服务实际监听端口错配会导致外部 000）。
  const port = 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`诗词鉴赏 API 服务已启动: http://localhost:${port}`);
}
bootstrap();
