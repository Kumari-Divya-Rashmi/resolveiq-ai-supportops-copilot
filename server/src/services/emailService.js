import nodemailer from "nodemailer";
import { env } from "../config/env.js";

function isEmailConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.EMAIL_FROM);
}

function createTransporter() {
  if (!isEmailConfigured()) return null;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

async function sendMail({ to, subject, text }) {
  const transporter = createTransporter();

  if (!transporter) {
    if (env.NODE_ENV !== "test") {
      console.log(`[email:stub] ${subject} -> ${to || "not configured"}`);
    }
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text
  });
}

export async function notifyTicketCreated(ticket) {
  await sendMail({
    to: ticket.userId?.email,
    subject: `Ticket created: ${ticket.title}`,
    text: `Your ticket "${ticket.title}" has been created. Priority: ${ticket.priority}.`
  });
}

export async function notifyTicketStatusChanged(ticket) {
  await sendMail({
    to: ticket.userId?.email,
    subject: `Ticket status updated: ${ticket.title}`,
    text: `Your ticket status is now ${ticket.status}.`
  });
}

export async function notifyTicketReopened(ticket) {
  await sendMail({
    to: ticket.userId?.email,
    subject: `Ticket reopened: ${ticket.title}`,
    text: `Your ticket has been reopened and is now under review.`
  });
}
