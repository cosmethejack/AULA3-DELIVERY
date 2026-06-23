import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = "Erro interno do servidor";
    let detail = "Ocorreu um erro inesperado";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      title = this.getTitleForStatus(status);
      detail = typeof res === "string" ? res : (res as any).message || title;
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

  private getTitleForStatus(status: number): string {
    const map: Record<number, string> = {
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
}