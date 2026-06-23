import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuditService } from "./audit.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;

    const isCud = ["POST", "PATCH", "PUT", "DELETE"].includes(method);

    if (!isCud) return next.handle();

    return next.handle().pipe(
      tap((responseBody) => {
        const userId = request.user?.sub;
        const entidade = path.split("/").pop() || path;
        this.audit.log({
          userId,
          acao: `${method}_${path.replace(/\//g, "_").toUpperCase()}`,
          entidade,
          entidadeId: responseBody?.id,
          payload: { method, path, body: request.body },
        });
      }),
    );
  }
}