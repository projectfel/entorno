import { describe, it, expect } from "vitest";
import SEOHead from "@/components/SEOHead";

describe("SEOHead", () => {
  it("exports a default function component", () => {
    expect(typeof SEOHead).toBe("function");
  });
});
