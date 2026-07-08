import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { redact } from "../observability/logger.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: { userId?: string; acao: string; entidade: string; entidadeId?: string; payload?: unknown }) {
    await this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        acao: params.acao,
        entidade: params.entidade,
        entidadeId: params.entidadeId,
        // Ofusca campos sensíveis antes de persistir a trilha.
        payload: params.payload !== undefined ? (redact(params.payload) as object) : undefined,
      },
    });
  }
}
