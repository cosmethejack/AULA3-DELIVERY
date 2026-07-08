import { Controller, Get, INestApplication } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { REQUEST_ID_HEADER, RequestIdInterceptor } from "./request-id.interceptor";

@Controller("ping")
class PingController {
  @Get()
  ping() {
    return { ok: true };
  }
}

describe("Observabilidade (integração)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PingController],
      providers: [{ provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("gera e propaga request_id na resposta quando ausente", async () => {
    const res = await request(app.getHttpServer()).get("/ping");
    expect(res.status).toBe(200);
    expect(res.headers[REQUEST_ID_HEADER]).toMatch(/[0-9a-f-]{36}/);
  });

  it("reutiliza o request_id recebido no header", async () => {
    const res = await request(app.getHttpServer())
      .get("/ping")
      .set(REQUEST_ID_HEADER, "req-fixo-123");
    expect(res.headers[REQUEST_ID_HEADER]).toBe("req-fixo-123");
  });
});
