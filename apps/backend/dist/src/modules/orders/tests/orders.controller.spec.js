"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const orders_controller_1 = require("../orders.controller");
const orders_service_1 = require("../orders.service");
describe("OrdersController", () => {
    let controller;
    let service;
    beforeEach(async () => {
        service = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), updateStatus: jest.fn(), cancel: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            controllers: [orders_controller_1.OrdersController],
            providers: [{ provide: orders_service_1.OrdersService, useValue: service }],
        }).compile();
        controller = module.get(orders_controller_1.OrdersController);
    });
    it("deve criar pedido", async () => {
        service.create.mockResolvedValue({ id: "o1" });
        const result = await controller.create({ clienteId: "c1", items: [] }, { user: { sub: "u1" } });
        expect(result.id).toBe("o1");
    });
    it("deve listar pedidos", async () => {
        service.findAll.mockResolvedValue([]);
        const result = await controller.findAll({ user: { sub: "u1", role: "ADMIN" } });
        expect(result).toEqual([]);
    });
    it("deve buscar pedido por id", async () => {
        service.findOne.mockResolvedValue({ id: "o1" });
        const result = await controller.findOne("o1");
        expect(result.id).toBe("o1");
    });
    it("deve atualizar status", async () => {
        service.updateStatus.mockResolvedValue({ status: "CONFIRMED" });
        const result = await controller.updateStatus("o1", "CONFIRMED", { user: { sub: "u1" } });
        expect(result.status).toBe("CONFIRMED");
    });
    it("deve cancelar pedido", async () => {
        service.cancel.mockResolvedValue({ status: "CANCELLED" });
        const result = await controller.cancel("o1", { user: { sub: "u1" } });
        expect(result.status).toBe("CANCELLED");
    });
});
//# sourceMappingURL=orders.controller.spec.js.map