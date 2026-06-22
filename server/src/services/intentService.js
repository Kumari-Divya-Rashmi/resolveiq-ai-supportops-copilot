export function detectSupportIntent(text = "") {
  const lower = text.toLowerCase();

  if (/create (a )?ticket|open (a )?case|talk to (an )?agent|human support|still need help/.test(lower)) {
    return { intent: "create_ticket", confidence: 0.9 };
  }

  if (/thank|rating|feedback|satisfied|unsatisfied/.test(lower)) {
    return { intent: "feedback", confidence: 0.72 };
  }

  if (/urgent|outage|blocked|cannot login|payment failed|production/.test(lower)) {
    return { intent: "urgent_support", confidence: 0.82 };
  }

  return { intent: "support_question", confidence: 0.68 };
}
