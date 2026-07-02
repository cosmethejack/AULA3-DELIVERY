import { CategoriesController } from "../categories.controller";

describe("CategoriesController", () => {
  let controller: CategoriesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    controller = new CategoriesController(service as never);
  });

  it("create delega o DTO", () => {
    const dto = { nome: "Bebidas" };
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("findAll converte page/limit para número", () => {
    controller.findAll("2", "5");
    expect(service.findAll).toHaveBeenCalledWith(2, 5);
  });

  it("findAll usa undefined quando sem query", () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
  });

  it("findOne repassa o id", () => {
    controller.findOne("c1");
    expect(service.findOne).toHaveBeenCalledWith("c1");
  });

  it("update repassa id e DTO", () => {
    controller.update("c1", { nome: "Novo" });
    expect(service.update).toHaveBeenCalledWith("c1", { nome: "Novo" });
  });

  it("remove repassa o id", () => {
    controller.remove("c1");
    expect(service.remove).toHaveBeenCalledWith("c1");
  });
});
