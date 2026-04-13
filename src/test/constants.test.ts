import { describe, it, expect } from "vitest";
import { ORDER_STATUS, ORDER_STATUS_LABELS, CACHE_TIMES, VALIDATION } from "@/constants";

describe("Constants", () => {
  it("has all order statuses with labels", () => {
    const statuses = Object.values(ORDER_STATUS);
    statuses.forEach((s) => {
      expect(ORDER_STATUS_LABELS[s]).toBeDefined();
      expect(typeof ORDER_STATUS_LABELS[s]).toBe("string");
    });
  });

  it("cache times are ordered correctly", () => {
    expect(CACHE_TIMES.SHORT).toBeLessThan(CACHE_TIMES.MEDIUM);
    expect(CACHE_TIMES.MEDIUM).toBeLessThan(CACHE_TIMES.LONG);
  });

  it("validation regex patterns work", () => {
    expect(VALIDATION.PHONE_REGEX.test("(84) 99999-0000")).toBe(true);
    expect(VALIDATION.PHONE_REGEX.test("abc")).toBe(false);
    expect(VALIDATION.WHATSAPP_REGEX.test("+55 84 99999-0000")).toBe(true);
  });

  it("password min length is reasonable", () => {
    expect(VALIDATION.PASSWORD_MIN).toBeGreaterThanOrEqual(6);
  });
});
