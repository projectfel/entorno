import { describe, it, expect } from "vitest";
import { isStoreOpen, getStoreStatusLabel } from "@/lib/storeStatus";

describe("isStoreOpen", () => {
  it("returns false for maintenance status", () => {
    expect(isStoreOpen({ status: "maintenance" })).toBe(false);
  });

  it("returns false for closed status", () => {
    expect(isStoreOpen({ status: "closed" })).toBe(false);
  });

  it("returns true for open status without hours", () => {
    expect(isStoreOpen({ status: "open" })).toBe(true);
  });

  it("returns true for open with null hours", () => {
    expect(isStoreOpen({ status: "open", opens_at: null, closes_at: null })).toBe(true);
  });
});

describe("getStoreStatusLabel", () => {
  it("returns 'Desativado' for maintenance", () => {
    const result = getStoreStatusLabel({ status: "maintenance" });
    expect(result.label).toBe("Desativado");
    expect(result.isOpen).toBe(false);
  });

  it("returns 'Fechado' for closed status", () => {
    const result = getStoreStatusLabel({ status: "closed" });
    expect(result.label).toBe("Fechado");
    expect(result.isOpen).toBe(false);
  });

  it("returns 'Aberto' for open without hours", () => {
    const result = getStoreStatusLabel({ status: "open" });
    expect(result.label).toBe("Aberto");
    expect(result.isOpen).toBe(true);
  });
});
