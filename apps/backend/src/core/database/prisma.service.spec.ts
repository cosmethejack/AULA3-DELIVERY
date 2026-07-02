import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  const originalUrl = process.env.DATABASE_URL;

  beforeAll(() => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/test";
  });

  afterAll(() => {
    process.env.DATABASE_URL = originalUrl;
  });

  it("conecta no onModuleInit e desconecta no onModuleDestroy", async () => {
    const service = new PrismaService();
    const connect = jest.spyOn(service, "$connect").mockResolvedValue(undefined as never);
    const disconnect = jest.spyOn(service, "$disconnect").mockResolvedValue(undefined as never);

    await service.onModuleInit();
    await service.onModuleDestroy();

    expect(connect).toHaveBeenCalledTimes(1);
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
