import { describe, expect, it } from "vitest";
import { calculateSlaRisk } from "../src/services/ticketRoutingService.js";

describe("calculateSlaRisk", () => {
  it("marks urgent and very high urgency tickets as high risk", () => {
    expect(calculateSlaRisk("urgent", 0.4, 0)).toBe("high");
    expect(calculateSlaRisk("medium", 0.9, 0)).toBe("high");
  });

  it("marks high priority or negative sentiment tickets as medium risk", () => {
    expect(calculateSlaRisk("high", 0.4, 0)).toBe("medium");
    expect(calculateSlaRisk("low", 0.3, -0.6)).toBe("medium");
  });

  it("keeps low urgency tickets as low risk", () => {
    expect(calculateSlaRisk("low", 0.2, 0.1)).toBe("low");
  });
});
