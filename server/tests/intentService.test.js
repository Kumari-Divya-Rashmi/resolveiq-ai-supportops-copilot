import { describe, expect, it } from "vitest";
import { detectSupportIntent } from "../src/services/intentService.js";

describe("detectSupportIntent", () => {
  it("detects explicit ticket creation requests", () => {
    expect(detectSupportIntent("I still need help, please create a ticket").intent).toBe("create_ticket");
  });

  it("defaults ordinary questions to support_question", () => {
    expect(detectSupportIntent("How do I reset my password?").intent).toBe("support_question");
  });
});
