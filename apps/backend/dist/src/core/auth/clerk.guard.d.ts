import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
export declare class ClerkGuard implements CanActivate {
    private reflector;
    private jwks;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private validateToken;
}
