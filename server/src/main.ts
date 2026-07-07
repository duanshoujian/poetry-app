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

  // 必须监听 Railway 注入的 PORT：Railway 的健康检查与外部路由都使用该端口，
  // 硬编码其他端口会导致健康检查失败（Deploy failed）。
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`诗词鉴赏 API 服务已启动: http://localhost:${port}`);
}
bootstrap();
