import { ProblemDetailsFilter } from "./problem-details.filter";
import { BadRequestException, ForbiddenException, HttpException, HttpStatus } from "@nestjs/common";

describe("ProblemDetailsFilter", () => {
  let filter: ProblemDetailsFilter;
  let mockJson: any;
  let mockResponse: any;

  beforeEach(() => {
    mockJson = jest.fn();
    mockResponse = { status: jest.fn().mockReturnValue({ json: mockJson }) };
    filter = new ProblemDetailsFilter();
  });

  it("deve formatar HttpException como Problem Details", () => {
    const exception = new BadRequestException("Requisição inválida");
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({ url: "/test" }),
      }),
    } as any;

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "https://httpstatuses.org/400",
        title: "Requisição inválida",
        status: 400,
        detail: "Requisição inválida",
        instance: "/test",
      }),
    );
  });

  it("deve formatar erro genérico como 500", () => {
    const exception = new Error("Algo deu errado");
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({ url: "/error" }),
      }),
    } as any;

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, title: "Erro interno do servidor" }),
    );
  });

  it("deve formatar 403 como acesso negado", () => {
    const exception = new ForbiddenException();
    const host = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({ url: "/admin" }),
      }),
    } as any;

    filter.catch(exception, host);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Acesso negado", status: 403 }),
    );
  });
});
