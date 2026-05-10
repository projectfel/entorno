import { describe, it, expect, vi, beforeEach } from "vitest";

const chain = () => {
  const c: any = {};
  c.insert = vi.fn().mockReturnValue(c);
  c.update = vi.fn().mockReturnValue(c);
  c.select = vi.fn().mockReturnValue(c);
  c.eq = vi.fn().mockReturnValue(c);
  c.order = vi.fn().mockReturnValue(c);
  c.single = vi.fn();
  c.maybeSingle = vi.fn();
  return c;
};

const mockChain = chain();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => mockChain),
  },
}));

import { ordersService } from "../orders";
import { supabase } from "@/integrations/supabase/client";

describe("ordersService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create() inserts order and returns data", async () => {
    mockChain.single.mockResolvedValueOnce({ data: { id: "o1", total: 50 }, error: null });
    const result = await ordersService.create({
      store_id: "s1",
      user_id: "u1",
      items: [{ product_id: "p1", quantity: 2 }] as any,
      total: 50,
    });
    expect(supabase.from).toHaveBeenCalledWith("orders");
    expect(mockChain.insert).toHaveBeenCalled();
    expect(result).toEqual({ id: "o1", total: 50 });
  });

  it("create() throws on error", async () => {
    mockChain.single.mockResolvedValueOnce({ data: null, error: { message: "fail" } });
    await expect(
      ordersService.create({ store_id: "s1", user_id: "u1", items: [] as any, total: 0 })
    ).rejects.toBeTruthy();
  });

  it("getByUser() filters by user_id and orders desc", async () => {
    mockChain.order.mockResolvedValueOnce({ data: [{ id: "o1" }], error: null });
    const result = await ordersService.getByUser("u1");
    expect(mockChain.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(mockChain.order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual([{ id: "o1" }]);
  });

  it("getByStore() filters by store_id", async () => {
    mockChain.order.mockResolvedValueOnce({ data: [], error: null });
    await ordersService.getByStore("s1");
    expect(mockChain.eq).toHaveBeenCalledWith("store_id", "s1");
  });

  it("updateStatus() updates and returns", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: { id: "o1", status: "confirmed" }, error: null });
    const result = await ordersService.updateStatus("o1", "confirmed");
    expect(mockChain.update).toHaveBeenCalledWith({ status: "confirmed" });
    expect(mockChain.eq).toHaveBeenCalledWith("id", "o1");
    expect(result?.status).toBe("confirmed");
  });
});
