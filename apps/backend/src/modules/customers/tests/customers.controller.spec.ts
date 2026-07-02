import { CustomersController } from "../customers.controller";

describe("CustomersController", () => {
  let controller: CustomersController;
  let service: { findAll: jest.Mock; findOne: jest.Mock; create: jest.Mock };

  beforeEach(() => {
    service = { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn() };
    controller = new CustomersController(service as any);
  });

  it("findAll delega para o service", () => {
    const clientes = [{ id: "c1" }];
    service.findAll.mockReturnValue(clientes);

    expect(controller.findAll()).toBe(clientes);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it("findOne repassa o id", () => {
    service.findOne.mockReturnValue({ id: "c1" });
    controller.findOne("c1");
    expect(service.findOne).toHaveBeenCalledWith("c1");
  });

  it("create repassa o corpo", () => {
    const body = { nome: "Ana", email: "ana@x.com" };
    controller.create(body);
    expect(service.create).toHaveBeenCalledWith(body);
  });
});