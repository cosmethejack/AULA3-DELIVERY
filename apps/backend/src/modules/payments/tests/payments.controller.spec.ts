import { Test, TestingModule } from "@nestjs/testing";
import { PaymentsController } from "../payments.controller";
import { PaymentsService } from "../payments.service";

describe("PaymentsController", () => {
  let controller: PaymentsController;
  let service: any;

  beforeEach(async () => {
    service = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: service }],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it("deve chamar service.create com parametros corretos", async () => {
    service.create.mockResolvedValue({ id: "pay-1" });
    const result = await controller.create("order-1", { valor: 39.9, metodo: "PIX" }, { user: { sub: "admin-1" } });
    expect(result!.id).toBe("pay-1");
    expect(service.create).toHaveBeenCalledWith("order-1", { valor: 39.9, metodo: "PIX" }, "admin-1");
  });
});
