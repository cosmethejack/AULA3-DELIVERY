import "reflect-metadata";
import { plainToInstance } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, validateSync } from "class-validator";

/**
 * Variáveis de ambiente exigidas/aceitas pelo backend.
 * Variáveis obrigatórias sem valor derrubam o boot (fail-fast).
 */
export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  GLOBAL_PREFIX?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  BACKEND_PORT?: number;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const detalhes = errors
      .map((e) => Object.values(e.constraints ?? {}).join(", "))
      .join("; ");
    throw new Error(`Configuração de ambiente inválida: ${detalhes}`);
  }

  return validated;
}
