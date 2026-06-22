import { describe, expect, it } from "vitest";
import { getHeuristicSentiment, normalizeSentiment } from "../src/services/sentimentService.js";

describe("sentimentService", () => {
  it("detects negative support language", () => {
    expect(getHeuristicSentiment("This is broken and I am frustrated").label).toBe("negative");
  });

  it("normalizes malformed sentiment payloads", () => {
    expect(normalizeSentiment({ label: "wild", score: 4 })).toEqual({ label: "neutral", score: 1 });
  });
});
