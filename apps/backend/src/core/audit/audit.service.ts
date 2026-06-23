import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: { userId?: string; acao: string; entidade: string; entidadeId?: string; payload?: any }) {
    await this.prisma.auditLog.create({
      data: {
        userId: params.userId,
        acao: params.acao,
        entidade: params.entidade,
        entidadeId: params.entidadeId,
        payload: params.payload ?? undefined,
      },
    });
  }
}
