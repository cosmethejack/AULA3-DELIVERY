import { CatalogController } from "../catalog.controller";

describe("CatalogController", () => {
  let controller: CatalogController;
  let service: { findAll: jest.Mock; findOne: jest.Mock };

  beforeEach(() => {
    service = { findAll: jest.fn(), findOne: jest.fn() };
    controller = new CatalogController(service as any);
  });

  it("findAll delega para o service", () => {
    const categorias = [{ id: "c1" }];
    service.findAll.mockReturnValue(categorias);

    expect(controller.findAll()).toBe(categorias);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });

  it("findOne repassa o id para o service", () => {
    const produto = { id: "p1" };
    service.findOne.mockReturnValue(produto);

    expect(controller.findOne("p1")).toBe(produto);
    expect(service.findOne).toHaveBeenCalledWith("p1");
  });
});