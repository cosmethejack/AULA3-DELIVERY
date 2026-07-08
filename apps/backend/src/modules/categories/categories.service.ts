import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/database/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

/** Gera um slug a partir do nome: minúsculas, sem acentos, espaços/símbolos → hífens. */
export function slugify(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "P2002";
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug?.trim() || slugify(dto.nome);
    try {
      return await this.prisma.category.create({ data: { nome: dto.nome, slug } });
    } catch (e) {
      if (isUniqueViolation(e)) {
        throw new ConflictException(`Slug '${slug}' já está em uso`);
      }
      throw e;
    }
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      this.prisma.category.count(),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (e) {
      if (isUniqueViolation(e)) {
        throw new ConflictException("Slug já está em uso");
      }
      throw e;
    }
  }

  /** Soft-delete: desativa a categoria preservando a FK dos produtos. */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: { ativo: false } });
  }
}
