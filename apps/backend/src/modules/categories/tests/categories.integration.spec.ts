import { INestApplication, ValidationPipe } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { CategoriesController } from "../categories.controller";
import { CategoriesService } from "../categories.service";
import { ClerkGuard } from "../../../core/auth/clerk.guard";
import { ProblemDetailsFilter } from "../../../core/filters/problem-details.filter";

jest.mock("jose", () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));
import { jwtVerify } from "jose";

describe("Categories API (integração RBAC)", () => {
  let app: INestApplication;
  const svc = {
    create: jest.fn().mockResolvedValue({ id: "1", nome: "Bebidas", slug: "bebidas" }),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: svc },
        { provide: APP_GUARD, useClass: ClerkGuard },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("v1");
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(new ProblemDetailsFilter());
    await app.init();
  });

  afterAll(async () => await app.close());
  beforeEach(() => jest.clearAllMocks());

  it("anônimo → 401 RFC 9457", async () => {
    const res = await request(app.getHttpServer()).post("/v1/categories").send({ nome: "X" });
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ status: 401, type: expect.any(String) });
  });

  it("CUSTOMER → 403 RFC 9457", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "CUSTOMER" } });
    const res = await request(app.getHttpServer())
      .post("/v1/categories")
      .set("Authorization", "Bearer t")
      .send({ nome: "X" });
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ status: 403 });
  });

  it("ADMIN cria → 201", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "ADMIN" } });
    const res = await request(app.getHttpServer())
      .post("/v1/categories")
      .set("Authorization", "Bearer t")
      .send({ nome: "Bebidas" });
    expect(res.status).toBe(201);
    expect(svc.create).toHaveBeenCalledWith({ nome: "Bebidas" });
  });

  it("ADMIN com payload inválido (campo extra) → 400 RFC 9457", async () => {
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: { sub: "u1", role: "ADMIN" } });
    const res = await request(app.getHttpServer())
      .post("/v1/categories")
      .set("Authorization", "Bearer t")
      .send({ nome: "Bebidas", hacker: true });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ status: 400 });
  });
});
