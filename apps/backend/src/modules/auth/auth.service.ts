import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

const CLERK_API = "https://api.clerk.com/v1";

/**
 * Autenticação via API backend do Clerk (sem SDK no frontend, conforme regras
 * de arquitetura em openspec/config.yaml). O fluxo espelha tests/helpers/auth.ts:
 * localiza o usuário, valida a senha e emite um JWT de sessão — que o ClerkGuard
 * valida via JWKS.
 */
@Injectable()
export class AuthService {
  private get secret(): string {
    const key = process.env.CLERK_SECRET_KEY;
    if (!key) {
      throw new InternalServerErrorException("CLERK_SECRET_KEY não configurada");
    }
    return key;
  }

  private headers(): Record<string, string> {
    return { Authorization: `Bearer ${this.secret}`, "Content-Type": "application/json" };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    const userId = await this.findUserByEmail(email);
    if (!userId) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    await this.verifyPassword(userId, password);

    const sessionId = await this.createSession(userId);
    const token = await this.mintToken(sessionId);
    return { token };
  }

  private async findUserByEmail(email: string): Promise<string | null> {
    const res = await fetch(
      `${CLERK_API}/users?email_address=${encodeURIComponent(email)}&limit=1`,
      { headers: this.headers() },
    );
    if (!res.ok) {
      throw new InternalServerErrorException("Falha ao consultar usuário no Clerk");
    }
    const data = await res.json();
    const user = Array.isArray(data) ? data[0] : (data?.data?.[0] ?? null);
    return user?.id ?? null;
  }

  private async verifyPassword(userId: string, password: string): Promise<void> {
    const res = await fetch(`${CLERK_API}/users/${userId}/verify_password`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
    const data = await res.json().catch(() => ({}));
    if (data && data.verified === false) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
  }

  private async createSession(userId: string): Promise<string> {
    const res = await fetch(`${CLERK_API}/sessions`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({ user_id: userId }),
    });
    if (!res.ok) {
      throw new InternalServerErrorException("Falha ao criar sessão no Clerk");
    }
    const session = await res.json();
    return session.id;
  }

  private async mintToken(sessionId: string): Promise<string> {
    const res = await fetch(`${CLERK_API}/sessions/${sessionId}/tokens`, {
      method: "POST",
      headers: this.headers(),
      body: "{}",
    });
    if (!res.ok) {
      throw new InternalServerErrorException("Falha ao gerar token no Clerk");
    }
    const data = await res.json();
    return data.jwt;
  }
}
