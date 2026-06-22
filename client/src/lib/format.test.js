import { describe, expect, it } from "vitest";
import { formatStatusLabel } from "./format.js";

describe("formatStatusLabel", () => {
  it("turns API enum values into readable labels", () => {
    expect(formatStatusLabel("waiting_on_customer")).toBe("waiting on customer");
  });

  it("handles empty values", () => {
    expect(formatStatusLabel()).toBe("unknown");
  });
});
