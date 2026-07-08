import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "Nome da categoria" })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiPropertyOptional({ description: "Slug único; gerado do nome quando ausente" })
  @IsOptional()
  @IsString()
  slug?: string;
}
