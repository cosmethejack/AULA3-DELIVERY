import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { Roles } from "../../core/auth/roles.decorator";

@Controller("customers")
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles("ADMIN")
  findAll() {
    return this.customersService.findAll();
  }

  @Get(":id")
  @Roles("ADMIN")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.customersService.create(body);
  }
}
