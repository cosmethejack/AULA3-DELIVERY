"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const payments_controller_1 = require("../payments.controller");
const payments_service_1 = require("../payments.service");
describe("PaymentsController", () => {
    let controller;
    let service;
    beforeEach(async () => {
        service = { create: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            controllers: [payments_controller_1.PaymentsController],
            providers: [{ provide: payments_service_1.PaymentsService, useValue: service }],
        }).compile();
        controller = module.get(payments_controller_1.PaymentsController);
    });
    it("deve chamar service.create com parametros corretos", async () => {
        service.create.mockResolvedValue({ id: "pay-1" });
        const result = await controller.create("order-1", { valor: 39.9, metodo: "PIX" }, { user: { sub: "admin-1" } });
        expect(result.id).toBe("pay-1");
        expect(service.create).toHaveBeenCalledWith("order-1", { valor: 39.9, metodo: "PIX" }, "admin-1");
    });
});
//# sourceMappingURL=payments.controller.spec.js.map