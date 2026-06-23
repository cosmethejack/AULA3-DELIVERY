import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { ativo: true },
      include: { products: { where: { ativo: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id }, include: { category: true } });
  }
}
