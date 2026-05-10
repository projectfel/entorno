import { describe, it, expect, vi, beforeEach } from "vitest";

const chain = () => {
  const c: any = {};
  c.select = vi.fn().mockReturnValue(c);
  c.insert = vi.fn().mockReturnValue(c);
  c.update = vi.fn().mockReturnValue(c);
  c.delete = vi.fn().mockReturnValue(c);
  c.eq = vi.fn().mockReturnValue(c);
  c.order = vi.fn().mockReturnValue(c);
  c.limit = vi.fn();
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

import { productsService } from "../products";

describe("productsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getByStore() filters by store and orders by sort_order", async () => {
    mockChain.order.mockResolvedValueOnce({ data: [{ id: "p1" }], error: null });
    const data = await productsService.getByStore("s1");
    expect(mockChain.eq).toHaveBeenCalledWith("store_id", "s1");
    expect(mockChain.order).toHaveBeenCalledWith("sort_order", { ascending: true });
    expect(data).toEqual([{ id: "p1" }]);
  });

  it("getFeatured() filters featured + in_stock and limits 8", async () => {
    mockChain.limit.mockResolvedValueOnce({ data: [], error: null });
    await productsService.getFeatured();
    expect(mockChain.eq).toHaveBeenCalledWith("featured", true);
    expect(mockChain.eq).toHaveBeenCalledWith("in_stock", true);
    expect(mockChain.limit).toHaveBeenCalledWith(8);
  });

  it("create() throws on error", async () => {
    mockChain.single.mockResolvedValueOnce({ data: null, error: { message: "x" } });
    await expect(
      productsService.create({ name: "X", price: 1, store_id: "s1" })
    ).rejects.toBeTruthy();
  });

  it("update() merges patch by id", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: { id: "p1", price: 9 }, error: null });
    const r = await productsService.update("p1", { price: 9 });
    expect(mockChain.update).toHaveBeenCalledWith({ price: 9 });
    expect(r).toEqual({ id: "p1", price: 9 });
  });

  it("remove() deletes by id", async () => {
    mockChain.eq.mockResolvedValueOnce({ error: null });
    await productsService.remove("p1");
    expect(mockChain.delete).toHaveBeenCalled();
  });
});
