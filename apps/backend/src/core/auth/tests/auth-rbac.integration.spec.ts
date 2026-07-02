import { Controller, Get, INestApplication } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { ClerkGuard } from "../clerk.guard";
import { Roles } from "../roles.decorator";
import { ProblemDetailsFilter } from "../../filters/problem-details.filter";

jest.mock("jose", () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));
import { jwtVerify } from "jose";

@Controller("secure")
class SecureController {
  @Get("public")
  publica() {
    return { ok: "public" };
  }

  @Get("admin")
  @Roles("ADMIN")
  admin() {
    return { ok: "admin" };
  }
}

describe("Auth/RBAC (integração)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [SecureController],
      providers: [{ provide: APP_GUARD, useClass: ClerkGuard }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("v1");
    app.useGlobalFilters(new ProblemDetailsFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => jest.clearAllMocks());

  it("rota pública (sem @Roles) é liberada sem token", async () => {
    const res = await request(app.getHttpServer()).get("/v1/secure/public");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: "public" });
  });

  it("rota protegida sem token → 401 no formato RFC 9457", async () => {
    const res = await request(app.getHttpServer()).get("/v1/secure/admin");
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      status: 401,
      type: expect.any(String),
      title: expect.any(String),
      instance: "/v1/secure/admin",
    });
  });

  it("rota protegida com papel errado → 403 no formato RFC 9457", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "CUSTOMER" } });

    const res = await request(app.getHttpServer())
      .get("/v1/secure/admin")
      .set("Authorization", "Bearer token-customer");

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ status: 403, type: expect.any(String) });
  });

  it("rota protegida com papel correto → 200", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "ADMIN" } });

    const res = await request(app.getHttpServer())
      .get("/v1/secure/admin")
      .set("Authorization", "Bearer token-admin");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: "admin" });
  });
});
