import { of } from "rxjs";
import { REQUEST_ID_HEADER, RequestIdInterceptor } from "./request-id.interceptor";

function mockContext(headers: Record<string, unknown>) {
  const request: any = { headers };
  const response: any = { setHeader: jest.fn() };
  const context: any = {
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
    }),
  };
  const next: any = { handle: () => of("ok") };
  return { context, next, request, response };
}

describe("RequestIdInterceptor", () => {
  const interceptor = new RequestIdInterceptor();

  it("gera um request_id quando ausente e o ecoa na resposta", () => {
    const { context, next, request, response } = mockContext({});

    interceptor.intercept(context, next);

    expect(request.requestId).toMatch(/[0-9a-f-]{36}/);
    expect(response.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, request.requestId);
  });

  it("reutiliza o request_id recebido no header", () => {
    const { context, next, request, response } = mockContext({ [REQUEST_ID_HEADER]: "req-123" });

    interceptor.intercept(context, next);

    expect(request.requestId).toBe("req-123");
    expect(response.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, "req-123");
  });

  it("gera novo id quando o header vem vazio", () => {
    const { context, next, request } = mockContext({ [REQUEST_ID_HEADER]: "" });

    interceptor.intercept(context, next);

    expect(request.requestId).toMatch(/[0-9a-f-]{36}/);
  });
});
