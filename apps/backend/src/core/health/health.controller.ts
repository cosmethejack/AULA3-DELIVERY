import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("health")
@Controller("health")
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Liveness/readiness da aplicação" })
  check() {
    return {
      status: "ok",
      service: "delivery-backend",
      timestamp: new Date().toISOString(),
    };
  }
}
