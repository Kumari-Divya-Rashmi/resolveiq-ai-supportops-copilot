import { env } from "../config/env.js";

export async function notifyTicketCreated(ticket) {
  if (env.NODE_ENV !== "test") {
    console.log(`[email:stub] Ticket ${ticket._id} created for ${ticket.title}`);
  }
}

export async function notifyTicketStatusChanged(ticket) {
  if (env.NODE_ENV !== "test") {
    console.log(`[email:stub] Ticket ${ticket._id} status changed to ${ticket.status}`);
  }
}
