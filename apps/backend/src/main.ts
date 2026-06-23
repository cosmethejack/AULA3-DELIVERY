import "./core/observability/otel";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ProblemDetailsFilter } from "./core/filters/problem-details.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || "v1", { exclude: ["/"] });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new ProblemDetailsFilter());
  await app.listen(process.env.BACKEND_PORT || 3001);
}
bootstrap();
