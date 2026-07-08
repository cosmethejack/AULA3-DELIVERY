import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Observable } from "rxjs";

export const REQUEST_ID_HEADER = "x-request-id";

/**
 * Gera um `request_id` quando ausente e reutiliza o recebido no header,
 * ecoando-o na resposta e disponibilizando-o na requisição para correlação.
 */
@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();

    const incoming = request.headers?.[REQUEST_ID_HEADER];
    const requestId = typeof incoming === "string" && incoming.length > 0 ? incoming : randomUUID();

    request.requestId = requestId;
    response.setHeader(REQUEST_ID_HEADER, requestId);

    return next.handle();
  }
}
