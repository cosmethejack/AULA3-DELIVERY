import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  health() {
    return {
      status: "ok",
      service: "delivery-backend",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
    };
  }
}
