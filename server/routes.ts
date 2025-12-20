import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSchema, insertCommentSchema } from "@shared/schema";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/emails", async (req, res) => {
    try {
      const folder = req.query.folder as string | undefined;
      const emails = folder
        ? await storage.getEmailsByFolder(folder)
        : await storage.getEmails();
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/emails/:id", async (req, res) => {
    try {
      const email = await storage.getEmail(req.params.id);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch email" });
    }
  });

  app.post("/api/emails", async (req, res) => {
    try {
      const parsed = insertEmailSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const email = await storage.createEmail(parsed.data);
      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to create email" });
    }
  });

  app.patch("/api/emails/:id", async (req, res) => {
    try {
      const email = await storage.updateEmail(req.params.id, req.body);
      if (!email) {
        return res.status(404).json({ error: "Email not found" });
      }
      res.json(email);
    } catch (error) {
      res.status(500).json({ error: "Failed to update email" });
    }
  });

  app.get("/api/comments", async (req, res) => {
    try {
      const emailId = req.query.emailId as string;
      if (!emailId) {
        return res.status(400).json({ error: "emailId is required" });
      }
      const comments = await storage.getCommentsByEmail(emailId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const parsed = insertCommentSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors });
      }
      const comment = await storage.createComment(parsed.data);
      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.get("/api/imap/emails", async (req, res) => {
    const { IMAP_HOST, IMAP_USER, IMAP_PASS, IMAP_PORT } = process.env;
    
    if (!IMAP_HOST || !IMAP_USER || !IMAP_PASS) {
      return res.status(500).json({ 
        error: "IMAP credentials not configured",
        message: "Please set IMAP_HOST, IMAP_USER, and IMAP_PASS in Secrets"
      });
    }

    const client = new ImapFlow({
      host: IMAP_HOST,
      port: parseInt(IMAP_PORT || "993"),
      secure: true,
      auth: {
        user: IMAP_USER,
        pass: IMAP_PASS,
      },
      logger: false,
    });

    try {
      await client.connect();
      const lock = await client.getMailboxLock("INBOX");
      
      try {
        const emails: any[] = [];
        const limit = parseInt(req.query.limit as string) || 20;
        const mailbox = client.mailbox;
        const totalMessages = mailbox && typeof mailbox === 'object' && 'exists' in mailbox ? mailbox.exists : 0;
        
        const messages = client.fetch(
          { seq: `${Math.max(1, totalMessages - limit + 1)}:*` },
          { 
            envelope: true, 
            source: true,
            uid: true,
            flags: true,
          }
        );

        for await (const message of messages) {
          if (!message.source) continue;
          const parsed = await simpleParser(message.source);
          const flags = message.flags || new Set<string>();
          
          const fromAddr = parsed.from?.value?.[0];
          const toAddrObj = Array.isArray(parsed.to) ? parsed.to[0]?.value?.[0] : parsed.to?.value?.[0];
          
          emails.push({
            id: message.uid.toString(),
            sender: fromAddr?.name || fromAddr?.address || "Unknown",
            senderEmail: fromAddr?.address || "",
            recipient: toAddrObj?.name || toAddrObj?.address || "",
            recipientEmail: toAddrObj?.address || "",
            subject: parsed.subject || "(No Subject)",
            preview: (parsed.text || "").slice(0, 150).replace(/\n/g, " "),
            body: parsed.html || parsed.textAsHtml || `<p>${parsed.text || ""}</p>`,
            timestamp: parsed.date?.toISOString() || new Date().toISOString(),
            isRead: flags.has("\\Seen"),
            isStarred: flags.has("\\Flagged"),
            folder: "inbox",
            category: "focus",
            hasAttachments: (parsed.attachments?.length || 0) > 0,
          });
        }

        emails.reverse();
        res.json(emails);
      } finally {
        lock.release();
      }
    } catch (error: any) {
      console.error("IMAP error:", error);
      res.status(500).json({ 
        error: "Failed to fetch emails",
        message: error.message || "Unknown error"
      });
    } finally {
      await client.logout().catch(() => {});
    }
  });

  app.post("/api/smtp/send", async (req, res) => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;
    
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(500).json({ 
        error: "SMTP credentials not configured",
        message: "Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in Secrets"
      });
    }

    const { to, subject, body, html } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: "Missing required fields: to, subject" });
    }

    const trackingToken = require("crypto").randomUUID();
    const baseUrl = process.env.BASE_URL || `https://${req.get("host")}`;
    const trackingPixel = `<img src="${baseUrl}/api/track?id=${trackingToken}" width="1" height="1" style="display:none" alt="" />`;
    const htmlWithTracking = (html || `<p>${body.replace(/\n/g, "</p><p>")}</p>`) + trackingPixel;

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || "587"),
      secure: parseInt(SMTP_PORT || "587") === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: SMTP_USER,
        to,
        subject,
        text: body,
        html: htmlWithTracking,
      });

      await storage.createEmail({
        sender: "You",
        senderEmail: SMTP_USER,
        recipient: to.split("@")[0] || to,
        recipientEmail: to,
        subject,
        body: htmlWithTracking,
        preview: body.slice(0, 150),
        folder: "sent",
        category: "focus",
        isRead: true,
        trackingToken,
      });

      res.json({ 
        success: true, 
        messageId: info.messageId,
        message: "Email sent successfully"
      });
    } catch (error: any) {
      console.error("SMTP error:", error);
      res.status(500).json({ 
        error: "Failed to send email",
        message: error.message || "Unknown error"
      });
    }
  });

  const TRANSPARENT_PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );

  app.get("/api/track", async (req, res) => {
    const token = req.query.id as string;
    if (token && token.length >= 32) {
      const email = await storage.getEmailByTrackingToken(token);
      if (email && !email.readAt) {
        await storage.updateEmail(email.id, { readAt: new Date() });
      }
    }
    res.set({
      "Content-Type": "image/png",
      "Content-Length": TRANSPARENT_PNG.length,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.send(TRANSPARENT_PNG);
  });

  app.get("/api/snippets", async (req, res) => {
    try {
      const snippets = await storage.getSnippets();
      res.json(snippets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch snippets" });
    }
  });

  return httpServer;
}
