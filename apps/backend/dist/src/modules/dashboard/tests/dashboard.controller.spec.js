"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const dashboard_controller_1 = require("../dashboard.controller");
const dashboard_service_1 = require("../dashboard.service");
describe("DashboardController", () => {
    let controller;
    let service;
    beforeEach(async () => {
        service = { summary: jest.fn() };
        const module = await testing_1.Test.createTestingModule({
            controllers: [dashboard_controller_1.DashboardController],
            providers: [{ provide: dashboard_service_1.DashboardService, useValue: service }],
        }).compile();
        controller = module.get(dashboard_controller_1.DashboardController);
    });
    it("deve retornar summary do dashboard", async () => {
        service.summary.mockResolvedValue({ vendasTotais: 10, recebido: 500 });
        const result = await controller.summary();
        expect(result.vendasTotais).toBe(10);
        expect(result.recebido).toBe(500);
    });
});
//# sourceMappingURL=dashboard.controller.spec.js.map