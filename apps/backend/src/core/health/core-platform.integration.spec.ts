import { Body, Controller, INestApplication, Post, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { IsString } from "class-validator";
import request from "supertest";
import { ProblemDetailsFilter } from "../filters/problem-details.filter";
import { HealthController } from "./health.controller";

class EchoDto {
  @IsString()
  nome!: string;
}

@Controller("echo")
class EchoController {
  @Post()
  create(@Body() dto: EchoDto) {
    return dto;
  }
}

describe("Plataforma core do backend (integração)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController, EchoController],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("v1");
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new ProblemDetailsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /v1/health responde 200", async () => {
    const res = await request(app.getHttpServer()).get("/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("rota inexistente responde 404 no formato RFC 9457", async () => {
    const res = await request(app.getHttpServer()).get("/v1/nao-existe");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      status: 404,
      type: expect.any(String),
      title: expect.any(String),
      detail: expect.any(String),
      instance: expect.any(String),
    });
  });

  it("payload inválido responde 400 no formato RFC 9457", async () => {
    const res = await request(app.getHttpServer())
      .post("/v1/echo")
      .send({ nome: 123, campoExtra: "x" });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      status: 400,
      type: expect.any(String),
      title: expect.any(String),
      instance: "/v1/echo",
    });
  });
});
