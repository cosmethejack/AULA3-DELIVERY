import { Test, TestingModule } from "@nestjs/testing";
import { DashboardController } from "../dashboard.controller";
import { DashboardService } from "../dashboard.service";

describe("DashboardController", () => {
  let controller: DashboardController;
  let service: any;

  beforeEach(async () => {
    service = { summary: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [{ provide: DashboardService, useValue: service }],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it("deve retornar summary do dashboard", async () => {
    service.summary.mockResolvedValue({ vendasTotais: 10, recebido: 500 });
    const result = await controller.summary();
    expect(result.vendasTotais).toBe(10);
    expect(result.recebido).toBe(500);
  });
});
