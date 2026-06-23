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
    return this.prisma.customer.create({ data });
  }
}
