const demoPassword = process.env.DEMO_USER_PASSWORD;

if (!demoPassword) {
  throw new Error("DEMO_USER_PASSWORD is required in server/.env for seeding demo users.");
}
export const demoTeams = [
  {
    name: "Billing Operations",
    categoriesHandled: ["billing"]
  },
  {
    name: "Technical Support",
    categoriesHandled: ["technical", "bug"]
  },
  {
    name: "Customer Success",
    categoriesHandled: ["account", "shipping", "feature_request", "general"]
  }
];

export const demoUsers = [
  {
    name: "Asha Admin",
    email: "admin@resolveiq.test",
    role: "admin",
    password: demoPassword
  },
  {
    name: "Ravi Agent",
    email: "agent@resolveiq.test",
    role: "agent",
    password: demoPassword,
    teamName: "Technical Support"
  },
  {
    name: "Neha Customer",
    email: "user@resolveiq.test",
    role: "user",
    password: demoPassword
  }
];

export const demoKnowledgeBase = [
  {
    title: "Password reset policy",
    sourceType: "faq",
    tags: ["account", "login", "password"],
    content:
      "Customers can reset their password from the login page using Forgot password. Reset links expire after 20 minutes. If the customer cannot access their email, support must verify the last four digits of the registered phone number before changing the email address."
  },
  {
    title: "Refund eligibility",
    sourceType: "policy",
    tags: ["billing", "refund", "invoice"],
    content:
      "ResolveIQ demo company offers full refunds within 14 days of purchase when usage is below 100 automation runs. After 14 days, billing agents can issue prorated credit only when a duplicate charge or service outage is verified."
  },
  {
    title: "SLA incident response",
    sourceType: "runbook",
    tags: ["technical", "sla", "urgent"],
    content:
      "Production outage, data-loss risk, login failures for multiple users, and payment failures are high-priority incidents. Agents should acknowledge within 15 minutes, collect account ID and screenshot, and escalate to Technical Support."
  },
  {
    title: "Shipment tracking",
    sourceType: "faq",
    tags: ["shipping", "tracking", "delivery"],
    content:
      "Customers can track shipment status from My Orders. Tracking numbers may take 24 hours to activate after dispatch. Missing delivery after the promised date should be routed to Customer Success."
  }
];
