import { describe, it, expect, vi, beforeEach } from "vitest";

const chain = () => {
  const c: any = {};
  c.select = vi.fn().mockReturnValue(c);
  c.update = vi.fn().mockReturnValue(c);
  c.eq = vi.fn().mockReturnValue(c);
  c.order = vi.fn();
  c.maybeSingle = vi.fn();
  return c;
};

const mockChain = chain();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => mockChain),
  },
}));

import { storesService } from "../stores";
import { supabase } from "@/integrations/supabase/client";

describe("storesService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getAll() reads from stores_public ordered by name", async () => {
    mockChain.order.mockResolvedValueOnce({ data: [{ id: "s1" }], error: null });
    const r = await storesService.getAll();
    expect(supabase.from).toHaveBeenCalledWith("stores_public");
    expect(mockChain.order).toHaveBeenCalledWith("name");
    expect(r).toEqual([{ id: "s1" }]);
  });

  it("getById() reads single from stores_public", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: { id: "s1" }, error: null });
    const r = await storesService.getById("s1");
    expect(supabase.from).toHaveBeenCalledWith("stores_public");
    expect(mockChain.eq).toHaveBeenCalledWith("id", "s1");
    expect(r).toEqual({ id: "s1" });
  });

  it("getByOwner() reads from stores filtered by owner_id", async () => {
    mockChain.eq.mockResolvedValueOnce({ data: [], error: null });
    await storesService.getByOwner("u1");
    expect(supabase.from).toHaveBeenCalledWith("stores");
    expect(mockChain.eq).toHaveBeenCalledWith("owner_id", "u1");
  });

  it("update() applies patch and throws on error", async () => {
    mockChain.maybeSingle.mockResolvedValueOnce({ data: null, error: { message: "x" } });
    await expect(storesService.update("s1", { name: "New" })).rejects.toBeTruthy();
  });
});
