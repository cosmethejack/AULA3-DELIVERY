"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemDetailsFilter = void 0;
const common_1 = require("@nestjs/common");
let ProblemDetailsFilter = class ProblemDetailsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let title = "Erro interno do servidor";
        let detail = "Ocorreu um erro inesperado";
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            title = this.getTitleForStatus(status);
            detail = typeof res === "string" ? res : res.message || title;
        }
        response.status(status).json({
            type: `https://httpstatuses.org/${status}`,
            title,
            status,
            detail,
            instance: request.url,
            timestamp: new Date().toISOString(),
        });
    }
    getTitleForStatus(status) {
        const map = {
            400: "Requisição inválida",
            401: "Não autorizado",
            403: "Acesso negado",
            404: "Não encontrado",
            409: "Conflito",
            422: "Entidade não processável",
            500: "Erro interno do servidor",
        };
        return map[status] || "Erro desconhecido";
    }
};
exports.ProblemDetailsFilter = ProblemDetailsFilter;
exports.ProblemDetailsFilter = ProblemDetailsFilter = __decorate([
    (0, common_1.Catch)()
], ProblemDetailsFilter);
//# sourceMappingURL=problem-details.filter.js.map