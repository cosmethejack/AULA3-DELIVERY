import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    return this.prisma.customer.findUnique({ where: { id }, include: { orders: true } });
  }

  async create(data: { nome: string; email: string; endereco?: string; telefone?: string }) {
    // Upsert por e-mail: no checkout guest o mesmo cliente pode comprar mais de
    // uma vez. Como email é único, reutilizamos o registro existente em vez de
    // falhar com violação de constraint.
    return this.prisma.customer.upsert({
      where: { email: data.email },
      update: { nome: data.nome, endereco: data.endereco, telefone: data.telefone },
      create: data,
    });
  }
}
