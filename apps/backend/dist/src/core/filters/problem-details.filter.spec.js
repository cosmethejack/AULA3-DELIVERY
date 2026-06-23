"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const problem_details_filter_1 = require("./problem-details.filter");
const common_1 = require("@nestjs/common");
describe("ProblemDetailsFilter", () => {
    let filter;
    let mockJson;
    let mockResponse;
    beforeEach(() => {
        mockJson = jest.fn();
        mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) };
        filter = new problem_details_filter_1.ProblemDetailsFilter();
    });
    it("deve formatar HttpException como Problem Details", () => {
        const exception = new common_1.BadRequestException("Requisição inválida");
        const host = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
                getRequest: () => ({ url: "/test" }),
            }),
        };
        filter.catch(exception, host);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
            type: "https://httpstatuses.org/400",
            title: "Requisição inválida",
            status: 400,
            detail: "Requisição inválida",
            instance: "/test",
        }));
    });
    it("deve formatar erro genérico como 500", () => {
        const exception = new Error("Algo deu errado");
        const host = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
                getRequest: () => ({ url: "/error" }),
            }),
        };
        filter.catch(exception, host);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ status: 500, title: "Erro interno do servidor" }));
    });
    it("deve formatar 403 como acesso negado", () => {
        const exception = new common_1.ForbiddenException();
        const host = {
            switchToHttp: () => ({
                getResponse: () => mockResponse,
                getRequest: () => ({ url: "/admin" }),
            }),
        };
        filter.catch(exception, host);
        expect(mockResponse.status).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({ title: "Acesso negado", status: 403 }));
    });
});
//# sourceMappingURL=problem-details.filter.spec.js.map