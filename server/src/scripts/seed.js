import bcrypt from "bcryptjs";
import { pathToFileURL } from "node:url";
import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { KnowledgeBase } from "../models/KnowledgeBase.js";
import { Team } from "../models/Team.js";
import { Ticket } from "../models/Ticket.js";
import { User } from "../models/User.js";
import { demoKnowledgeBase, demoTeams, demoUsers } from "../data/demoData.js";
import { createEmbedding } from "../services/aiService.js";

async function upsertTeams() {
  const teamMap = new Map();

  for (const teamData of demoTeams) {
    const team = await Team.findOneAndUpdate(
      { name: teamData.name },
      { $set: teamData },
      { upsert: true, new: true }
    );
    teamMap.set(team.name, team);
  }

  return teamMap;
}

async function upsertUsers(teamMap) {
  const userMap = new Map();

  for (const userData of demoUsers) {
    const team = userData.teamName ? teamMap.get(userData.teamName) : null;
    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = await User.findOneAndUpdate(
      { email: userData.email },
      {
        $set: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          passwordHash,
          team: team?._id ?? null
        }
      },
      { upsert: true, new: true }
    );

    if (team) {
      await Team.findByIdAndUpdate(team._id, { $addToSet: { agents: user._id } });
    }

    userMap.set(user.email, user);
  }

  return userMap;
}

async function upsertKnowledgeBase(admin) {
  for (const article of demoKnowledgeBase) {
    const embedding = await createEmbedding(`${article.title}\n${article.content}`);
    await KnowledgeBase.findOneAndUpdate(
      { title: article.title },
      {
        $set: {
          ...article,
          embedding,
          uploadedBy: admin._id
        }
      },
      { upsert: true, new: true }
    );
  }
}

async function seedTickets(userMap, teamMap) {
  const user = userMap.get("user@resolveiq.test");
  const agent = userMap.get("agent@resolveiq.test");
  const technicalTeam = teamMap.get("Technical Support");
  const billingTeam = teamMap.get("Billing Operations");

  const tickets = [
    {
      userId: user._id,
      title: "Cannot log in after password reset",
      description: "I reset my password twice but the new password is still rejected.",
      category: "account",
      priority: "high",
      sentiment: { label: "negative", score: -0.6 },
      urgencyScore: 0.78,
      slaRisk: "high",
      status: "in_progress",
      assignedTeam: technicalTeam._id,
      assignedAgent: agent._id,
      aiSummary: "Customer cannot log in even after two password resets.",
      aiSuggestedReply:
        "I can help with that. Please confirm whether you received the reset email and share any error text shown after entering the new password.",
      aiConfidence: 0.82,
      messages: [
        {
          role: "user",
          author: user._id,
          body: "I reset my password twice but the new password is still rejected."
        }
      ]
    },
    {
      userId: user._id,
      title: "Duplicate invoice charge",
      description: "My card was charged twice for the same monthly invoice.",
      category: "billing",
      priority: "medium",
      sentiment: { label: "negative", score: -0.45 },
      urgencyScore: 0.58,
      slaRisk: "medium",
      status: "open",
      assignedTeam: billingTeam._id,
      aiSummary: "Customer reports duplicate monthly invoice charge.",
      aiSuggestedReply:
        "Thanks for reporting this. Please share the invoice number and both transaction timestamps so billing can verify the duplicate charge.",
      aiConfidence: 0.8,
      messages: [
        {
          role: "user",
          author: user._id,
          body: "My card was charged twice for the same monthly invoice."
        }
      ]
    }
  ];

  for (const ticket of tickets) {
    const embedding = await createEmbedding(`${ticket.title}\n${ticket.description}`);
    await Ticket.findOneAndUpdate(
      { title: ticket.title, userId: ticket.userId },
      { $set: { ...ticket, embedding } },
      { upsert: true, new: true }
    );
  }
}

export async function seedDatabase({ manageConnection = true } = {}) {
  if (manageConnection) {
    await connectDatabase();
  }

  const teamMap = await upsertTeams();
  const userMap = await upsertUsers(teamMap);
  await upsertKnowledgeBase(userMap.get("admin@resolveiq.test"));
  await seedTickets(userMap, teamMap);

  if (manageConnection) {
    await disconnectDatabase();
  }

  console.log("ResolveIQ demo data seeded.");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDatabase().catch(async (error) => {
    console.error("Seed failed");
    console.error(error);
    await disconnectDatabase();
    process.exit(1);
  });
}
