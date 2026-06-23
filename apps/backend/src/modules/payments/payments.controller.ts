import { Controller, Post, Param, Body, Req } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { Roles } from "../../core/auth/roles.decorator";

@Controller("orders/:id/payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles("ADMIN")
  create(@Param("id") id: string, @Body() body: any, @Req() req: any) {
    return this.paymentsService.create(id, body, req.user?.sub);
  }
}
