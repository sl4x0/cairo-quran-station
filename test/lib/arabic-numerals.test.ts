import { describe, it, expect } from "vitest";
import { toArabicNum } from "@/lib/arabic-numerals";

describe("toArabicNum", () => {
  it("converts single digit numbers", () => {
    expect(toArabicNum("0")).toBe("٠");
    expect(toArabicNum("1")).toBe("١");
    expect(toArabicNum("5")).toBe("٥");
    expect(toArabicNum("9")).toBe("٩");
  });

  it("converts multi-digit numbers", () => {
    expect(toArabicNum("10")).toBe("١٠");
    expect(toArabicNum("123")).toBe("١٢٣");
    expect(toArabicNum("2025")).toBe("٢٠٢٥");
  });

  it("handles decimal numbers", () => {
    expect(toArabicNum("98.2")).toBe("٩٨.٢");
    expect(toArabicNum("3.14")).toBe("٣.١٤");
  });

  it("preserves non-numeric characters", () => {
    expect(toArabicNum("FM 98.2")).toBe("FM ٩٨.٢");
  });

  it("handles empty strings", () => {
    expect(toArabicNum("")).toBe("");
  });
});
