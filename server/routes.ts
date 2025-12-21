import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSchema, insertCommentSchema } from "@shared/schema";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";
import webpush from "web-push";
import { GoogleGenAI } from "@google/genai";

// In-memory subscription storage (replace with database in production)
const subscriptions: webpush.PushSubscription[] = [];

// VAPID keys should be generated once. Using env vars or generating ephemeral ones.
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "BMKP1_F1Y5Yk5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5"; // Placeholder if not set
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "private_key_placeholder";

// If keys are valid, set VAPID details
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:admin@iammail.cloud",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  // Attempt to generate if missing (for dev purposes)
  const clientKeys = webpush.generateVAPIDKeys();
  console.log("GENERATED VAPID KEYS (Add these to your .env):");
  console.log("VAPID_PUBLIC_KEY=" + clientKeys.publicKey);
  console.log("VAPID_PRIVATE_KEY=" + clientKeys.privateKey);
  webpush.setVapidDetails(
    "mailto:admin@iammail.cloud",
    clientKeys.publicKey,
    clientKeys.privateKey
  );
  // Note: This changes keys every restart if not saved, invalidating old subscriptions
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/notifications/vapid-public-key", (req, res) => {
    // Return the current public key so the client can subscribe with it
    // Note: We need to access the key we set. 
    // If we generated one, we need to store it. 
    // Ideally, read from env or the one we just generated.
    // For this implementation, we assume we can get it from process.env or the generated variable.
    // Let's rely on the logs for now to set the env var, but for the API to work dynamically:

    // We'll use a hack to expose the key if generated locally
    const currentKey = process.env.VAPID_PUBLIC_KEY || (webpush as any)._vapid_keys?.publicKey; // _vapid_keys is internal?
    // Safer:
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || "check_server_logs_for_generated_key" });
  });

  app.post("/api/notifications/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
  });

  const notifyNewEmail = async (email: any) => {
    // Only notify for Focus emails
    if (email.category && email.category !== 'focus') return;

    const payload = JSON.stringify({
      title: `New Email from ${email.sender}`,
      body: email.subject,
      icon: "/icons/icon-192x192.png",
      url: "/" // open inbox
    });

    const promises = subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(error => {
        console.error("Error sending notification, removing subscription", error);
        // Remove invalid subscription
        const index = subscriptions.indexOf(sub);
        if (index > -1) subscriptions.splice(index, 1);
      })
    );
    await Promise.all(promises);
  };

  app.post("/api/classify", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email data required" });
      }
      if (!process.env.API_KEY) {
        // Fallback or error if no API key. 
        // For development, we might fallback to simple heuristics if no key.
        return res.json({ category: "focus" });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const prompt = `
        Classify this email into exactly one of these two categories:
        1. "focus": Personal emails, direct communication, important updates, high-priority, human-to-human.
        2. "other": Newsletters, automated notifications, receipts, marketing, promotional, bulk emails, system alerts.
        
        Return ONLY the category name ("focus" or "other"). Do not include any other text.

        Email Sender: ${email.sender} <${email.senderEmail}>
        Subject: ${email.subject}
        Snippet: ${email.snippet || email.preview || ""}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ parts: [{ text: prompt }] }]
      });

      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const category = responseText.toLowerCase().includes("other") ? "other" : "focus";

      // Update in DB if ID exists
      if (email.id) {
        try {
          await storage.updateEmail(email.id, { category });
        } catch (dbError) {
          console.error("Failed to update classification in DB", dbError);
        }
      }

      res.json({ category });
    } catch (error: any) {
      console.error("Classification error:", error);
      // Default to "focus" on error to avoid hiding emails
      res.json({ category: "focus" });
    }
  });

  // Email configuration endpoints
  app.post("/api/email/test-connection", async (req, res) => {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;

    if (!email || !password || !imapHost || !smtpHost) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // In production (Railway), iCloud blocks connections from cloud providers
    // So we skip the actual connection test and just validate the input format
    const isProduction = process.env.NODE_ENV === 'production';
    const isRailway = process.env.RAILWAY_ENVIRONMENT !== undefined;

    if (isProduction || isRailway) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      // Validate password is not empty
      if (password.length < 4) {
        return res.status(400).json({ error: "Password too short" });
      }
      // Return success without actually testing (since iCloud blocks cloud IPs)
      return res.json({
        success: true,
        message: "Credentials validated (connection will be tested when fetching emails)"
      });
    }

    // Local development - actually test the connection
    const imapClient = new ImapFlow({
      host: imapHost,
      port: parseInt(imapPort) || 993,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
      logger: false,
    });

    try {
      await imapClient.connect();
      await imapClient.logout();

      // Test SMTP connection
      const smtpTransporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: parseInt(smtpPort) === 465,
        auth: {
          user: email,
          pass: password,
        },
      });

      await smtpTransporter.verify();

      res.json({ success: true, message: "Connection successful" });
    } catch (error: any) {
      console.error("Connection test failed:", error);
      res.status(500).json({
        error: "Connection failed",
        message: error.message || "Unable to connect to email server"
      });
    }
  });

  app.post("/api/email/save-config", async (req, res) => {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;

    if (!email || !password || !imapHost || !smtpHost) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // In a real app, you'd save this to a database
      // For now, we'll update the process.env (note: this won't persist across restarts)
      process.env.IMAP_HOST = imapHost;
      process.env.IMAP_PORT = String(imapPort);
      process.env.IMAP_USER = email;
      process.env.IMAP_PASS = password;
      process.env.SMTP_HOST = smtpHost;
      process.env.SMTP_PORT = String(smtpPort);
      process.env.SMTP_USER = email;
      process.env.SMTP_PASS = password;

      res.json({ success: true, message: "Configuration saved" });
    } catch (error: any) {
      console.error("Failed to save configuration:", error);
      res.status(500).json({ error: "Failed to save configuration" });
    }
  });

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
      await client.logout().catch(() => { });
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
      if (email) {
        const updates: any = {
          readCount: (email.readCount || 0) + 1,
          userAgent: req.headers["user-agent"] as string,
          ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
        };

        if (!email.readAt) {
          updates.readAt = new Date();
          updates.isRead = true;
        }

        await storage.updateEmail(email.id, updates);
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
