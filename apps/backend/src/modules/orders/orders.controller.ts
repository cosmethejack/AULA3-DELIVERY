import { Controller, Get, Post, Patch, Param, Body, Req } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { Roles } from "../../core/auth/roles.decorator";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles("CUSTOMER", "ADMIN")
  create(@Body() body: any, @Req() req: any) {
    return this.ordersService.create(body);
  }

  @Get()
  @Roles("CUSTOMER", "ADMIN")
  findAll(@Req() req: any) {
    const isAdmin = req.user?.role === "ADMIN";
    return this.ordersService.findAll(isAdmin ? undefined : req.user?.sub);
  }

  @Get(":id")
  @Roles("CUSTOMER", "ADMIN")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(":id/status")
  @Roles("ADMIN")
  updateStatus(@Param("id") id: string, @Body("status") status: any, @Req() req: any) {
    return this.ordersService.updateStatus(id, status, req.user?.sub);
  }

  @Post(":id/cancel")
  @Roles("CUSTOMER", "ADMIN")
  cancel(@Param("id") id: string, @Req() req: any) {
    return this.ordersService.cancel(id, req.user?.sub);
  }
}
