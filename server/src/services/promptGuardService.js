const suspiciousPatterns = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt/i,
  /developer\s+message/i,
  /reveal\s+(the\s+)?prompt/i,
  /jailbreak/i,
  /bypass\s+policy/i
];

export function detectPromptInjection(text = "") {
  return suspiciousPatterns.some((pattern) => pattern.test(text));
}

export function sanitizeForPrompt(text = "") {
  return text.replace(/```/g, "'''").trim();
}
