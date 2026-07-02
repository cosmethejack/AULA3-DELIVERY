import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("retorna status ok com metadados", () => {
    const res = new HealthController().check();
    expect(res.status).toBe("ok");
    expect(res.service).toBe("delivery-backend");
    expect(typeof res.timestamp).toBe("string");
  });
});
