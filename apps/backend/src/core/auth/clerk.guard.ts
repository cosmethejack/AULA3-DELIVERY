import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";
import { createRemoteJWKSet, jwtVerify } from "jose";

const CLERK_ISSUER = process.env.CLERK_ISSUER || "https://sacred-tiger-84.clerk.accounts.dev";

@Injectable()
export class ClerkGuard implements CanActivate {
  private jwks = createRemoteJWKSet(new URL(`${CLERK_ISSUER}/.well-known/jwks.json`));

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Token ausente");
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = await this.validateToken(token);

    if (!payload) {
      throw new UnauthorizedException("Token inválido");
    }

    request.user = payload;

    const userRole =
      payload.role || payload.public_metadata?.role || payload.metadata?.role || "CUSTOMER";
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException("Acesso negado");
    }

    return true;
  }

  private async validateToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, this.jwks, {
        issuer: CLERK_ISSUER,
      });
      return payload;
    } catch {
      return null;
    }
  }
}
