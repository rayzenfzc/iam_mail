import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmailSchema, insertCommentSchema } from "@shared/schema";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import nodemailer from "nodemailer";
import webpush from "web-push";
import { GoogleGenAI } from "@google/genai";
import { detectProvider, getProvider, EMAIL_PROVIDERS } from "./email-providers";
import { zohoAdmin, isZohoConfigured } from "./zoho-admin";
import crypto from "crypto";

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

  // ============================================
  // HEALTH CHECK (Required for Render.com)
  // ============================================
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  });

  // ============================================
  // @HUB AI ASSISTANT ENDPOINTS
  // ============================================

  // Parse user message into structured intent
  app.post("/api/hub/parse", async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const { parseHubIntent } = await import("./hub-intent");
      const intent = await parseHubIntent(message, context || {});

      res.json(intent);
    } catch (error) {
      console.error("Hub parse error:", error);
      res.status(500).json({
        type: "help",
        action: "error",
        entities: {},
        confidence: 0,
        error: "Failed to parse intent"
      });
    }
  });

  // Execute confirmed action
  app.post("/api/hub/execute", async (req, res) => {
    try {
      const { intent, confirmed } = req.body;

      if (!confirmed) {
        return res.status(400).json({ error: "Action must be confirmed" });
      }

      const { executeHubIntent } = await import("./hub-intent");
      const result = await executeHubIntent(intent);

      res.json(result);
    } catch (error) {
      console.error("Hub execute error:", error);
      res.status(500).json({ success: false, message: "Execution failed" });
    }
  });

  // Get contextual suggestions based on current screen
  app.get("/api/hub/suggestions", async (req, res) => {
    try {
      const { screen } = req.query;

      const suggestions: Record<string, string[]> = {
        inbox: [
          "Compose new email",
          "Search emails",
          "Show unread",
          "Summarize inbox"
        ],
        "email-detail": [
          "Reply",
          "Summarize",
          "Schedule meeting",
          "Add sender to contacts",
          "Forward"
        ],
        compose: [
          "Shorten",
          "Make professional",
          "Schedule send",
          "Add attachment"
        ],
        calendar: [
          "New meeting",
          "Today's schedule",
          "Find free time",
          "Monthly summary"
        ],
        contacts: [
          "Add contact",
          "Recent contacts",
          "Important contacts"
        ],
        settings: [
          "Toggle dark mode",
          "Add account",
          "Manage notifications",
          "Export data"
        ]
      };

      res.json({
        screen: screen || "inbox",
        suggestions: suggestions[screen as string] || suggestions.inbox
      });
    } catch (error) {
      console.error("Hub suggestions error:", error);
      res.status(500).json({ suggestions: [] });
    }
  });

  // ============================================
  // AUTHENTICATION ENDPOINTS
  // ============================================

  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const { authService } = await import("./auth");
      const { user, token } = await authService.signup(email, password);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          preferences: user.preferences
        }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const { authService } = await import("./auth");
      const { user, token } = await authService.login(email, password);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          preferences: user.preferences
        }
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  });

  // Genesis Protocol - Connect Email Account
  app.post("/api/auth/connect", async (req, res) => {
    try {
      const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { authService, verifyToken } = await import("./auth");
      const payload = verifyToken(token);

      if (!payload) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const result = await authService.connectEmailAccount(
        payload.userId,
        email,
        password,
        imapHost || `imap.${email.split('@')[1]}`,
        imapPort || 993,
        smtpHost || `smtp.${email.split('@')[1]}`,
        smtpPort || 587
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { authService, verifyToken } = await import("./auth");
      const payload = verifyToken(token);

      if (!payload) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const user = await authService.getUserById(payload.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user preferences
  app.patch("/api/user/preferences", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { authService, verifyToken } = await import("./auth");
      const payload = verifyToken(token);

      if (!payload) {
        return res.status(401).json({ error: "Invalid token" });
      }

      await authService.updatePreferences(payload.userId, req.body);
      res.json({ success: true, message: "Preferences updated" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CALENDAR & OPPORTUNITIES ENDPOINTS
  // ============================================

  // Get calendar events
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { startDate, endDate, userId } = req.query;

      const userIdToUse = userId as string || (token ? (await import("./auth")).verifyToken(token)?.userId : null);
      if (!userIdToUse) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      const events = await calendarService.getEvents(
        userIdToUse,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );

      res.json(events);
    } catch (error: any) {
      console.error('Get events error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create calendar event
  app.post("/api/calendar/events", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;

      const userId = req.body.userId || payload?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      const event = await calendarService.createEvent(userId, req.body);

      res.status(201).json(event);
    } catch (error: any) {
      console.error('Create event error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update calendar event
  app.patch("/api/calendar/events/:id", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;

      const userId = req.body.userId || payload?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      const event = await calendarService.updateEvent(userId, req.params.id, req.body);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (error: any) {
      console.error('Update event error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete calendar event
  app.delete("/api/calendar/events/:id", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = (req.query.userId as string) || payload?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      await calendarService.deleteEvent(userId, req.params.id);

      res.json({ success: true, message: "Event deleted" });
    } catch (error: any) {
      console.error('Delete event error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get opportunities
  app.get("/api/opportunities", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { status, priority, userId } = req.query;

      const userIdToUse = userId as string || (token ? (await import("./auth")).verifyToken(token)?.userId : null);
      if (!userIdToUse) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      const opportunities = await calendarService.getOpportunities(userIdToUse, {
        status: status as string,
        priority: priority as string
      });

      res.json(opportunities);
    } catch (error: any) {
      console.error('Get opportunities error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create opportunity
  app.post("/api/opportunities", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;

      const userId = req.body.userId || payload?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { calendarService } = await import("./calendar");
      const opportunity = await calendarService.createOpportunity(userId, req.body);

      res.status(201).json(opportunity);
    } catch (error: any) {
      console.error('Create opportunity error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Convert opportunity to event (Drag-and-Drop)
  app.post("/api/calendar/convert", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;

      const userId = req.body.userId || payload?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { opportunityId, startDate, endDate, allDay, location } = req.body;

      if (!opportunityId || !startDate || !endDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { calendarService } = await import("./calendar");
      const event = await calendarService.convertOpportunityToEvent(userId, opportunityId, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        allDay,
        location
      });

      res.json({ success: true, event });
    } catch (error: any) {
      console.error('Convert opportunity error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // CONTACTS ENDPOINTS
  // ============================================

  // Get all contacts for user
  app.get("/api/contacts", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = (req.query.userId as string) || payload?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { contactsService } = await import("./contacts");
      const contacts = await contactsService.getContacts(userId);

      res.json(contacts);
    } catch (error: any) {
      console.error('Get contacts error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Search contacts
  app.get("/api/contacts/search", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = (req.query.userId as string) || payload?.userId;
      const query = req.query.q as string;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }

      const { contactsService } = await import("./contacts");
      const contacts = await contactsService.searchContacts(userId, query);

      res.json(contacts);
    } catch (error: any) {
      console.error('Search contacts error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Create contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = req.body.userId || payload?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { contactsService } = await import("./contacts");
      const contact = await contactsService.createContact(userId, req.body);

      res.status(201).json(contact);
    } catch (error: any) {
      console.error('Create contact error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update contact
  app.patch("/api/contacts/:id", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = req.body.userId || payload?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { contactsService } = await import("./contacts");
      const contact = await contactsService.updateContact(userId, req.params.id, req.body);

      res.json(contact);
    } catch (error: any) {
      console.error('Update contact error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Delete contact
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const payload = token ? (await import("./auth")).verifyToken(token) : null;
      const userId = (req.query.userId as string) || payload?.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { contactsService } = await import("./contacts");
      await contactsService.deleteContact(userId, req.params.id);

      res.json({ success: true });
    } catch (error: any) {
      console.error('Delete contact error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // AI INTEGRATION ENDPOINTS
  // ============================================

  // Interpret natural language command
  app.post("/api/ai/interpret", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { command, context } = req.body;

      if (!command) {
        return res.status(400).json({ error: "Command required" });
      }

      const { aiService } = await import("./ai");
      const action = await aiService.interpretCommand(command, context);

      res.json(action);
    } catch (error: any) {
      console.error('AI interpret error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generate email draft
  app.post("/api/ai/compose", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { to, subject, context, tone, length } = req.body;

      const { aiService } = await import("./ai");
      const draft = await aiService.composeEmail({
        to,
        subject,
        context,
        tone,
        length
      });

      res.json(draft);
    } catch (error: any) {
      console.error('AI compose error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Summarize email
  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const { email } = req.body;

      if (!email || !email.subject || !email.body) {
        return res.status(400).json({ error: "Email data required" });
      }

      const { aiService } = await import("./ai");
      const summary = await aiService.summarizeEmail(email);

      res.json({ summary });
    } catch (error: any) {
      console.error('AI summarize error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // NOTIFICATIONS & PUSH
  // ============================================

  app.get("/api/notifications/vapid-public-key", (req, res) => {
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
    let { email, password, imapHost, imapPort, smtpHost, smtpPort, provider } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Auto-detect provider if not specified or if hosts not provided
    if (!imapHost || !smtpHost) {
      const detected = detectProvider(email);
      console.log(`Auto-detected provider for ${email}: ${detected.config.name}`);

      imapHost = imapHost || detected.config.imap.host;
      imapPort = imapPort || detected.config.imap.port;
      smtpHost = smtpHost || detected.config.smtp.host;
      smtpPort = smtpPort || detected.config.smtp.port;
      provider = provider || detected.key;
    }

    console.log(`Testing connection: ${email} via ${imapHost}:${imapPort} / ${smtpHost}:${smtpPort}`);

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
        message: "Credentials validated (connection will be tested when fetching emails)",
        provider: provider
      });
    }

    // Local development - actually test the connection with timeout
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
      // Wrap in promise to catch ALL errors including timeout
      await new Promise(async (resolve, reject) => {
        // Handle ALL error events
        const errorHandler = (err: any) => {
          reject(err);
        };

        imapClient.on('error', errorHandler);

        try {
          // 10 second timeout
          const timeoutId = setTimeout(() => {
            reject(new Error('Connection timeout (10s)'));
          }, 10000);

          await imapClient.connect();
          clearTimeout(timeoutId);
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
            connectionTimeout: 10000,
          });

          await smtpTransporter.verify();

          imapClient.removeListener('error', errorHandler);
          resolve(true);
        } catch (err) {
          imapClient.removeListener('error', errorHandler);
          reject(err);
        }
      });

      res.json({ success: true, message: "Connection successful", provider: provider });
    } catch (error: any) {
      // Ensure client is closed
      try {
        await imapClient.logout();
      } catch (e) {
        // Ignore logout errors
      }
      console.error("Connection test failed:", error.message);
      console.error("Attempted connection to:", { imapHost, imapPort, smtpHost, smtpPort, email });
      res.status(500).json({
        error: "Connection failed",
        message: error.message || "Unable to connect to email server",
        details: `IMAP: ${imapHost}:${imapPort}, SMTP: ${smtpHost}:${smtpPort}`
      });
    }
  });

  app.post("/api/email/save-config", async (req, res) => {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort, userId } = req.body;

    if (!email || !password || !imapHost || !smtpHost) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Check if Firebase is configured
      const hasFirebase = process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY;

      if (hasFirebase) {
        // Full Firebase implementation
        const { accountsService } = await import("./accounts");

        // Use email as userId if not provided (for now)
        const userIdToUse = userId || email;

        // Create account in Firestore
        await accountsService.createAccount(userIdToUse, {
          email,
          password,
          imapHost,
          imapPort: parseInt(imapPort) || 993,
          smtpHost,
          smtpPort: parseInt(smtpPort) || 587
        });

        // Set as active account
        const accounts = await accountsService.getAccounts(userIdToUse);
        const newAccount = accounts.find(acc => acc.email === email);
        if (newAccount) {
          await accountsService.setActiveAccount(userIdToUse, newAccount.id);
        }
      }

      // Always update process.env (works without Firebase)
      process.env.IMAP_HOST = imapHost;
      process.env.IMAP_PORT = String(imapPort);
      process.env.IMAP_USER = email;
      process.env.IMAP_PASS = password;
      process.env.SMTP_HOST = smtpHost;
      process.env.SMTP_PORT = String(smtpPort);
      process.env.SMTP_USER = email;
      process.env.SMTP_PASS = password;

      console.log(`✅ Saved email config for: ${email} ${hasFirebase ? '(Firestore + process.env)' : '(process.env only)'}`);

      res.json({
        success: true,
        message: hasFirebase ? "Account saved to database" : "Account saved (Firebase not configured - using temporary storage)",
        usesFirebase: hasFirebase
      });
    } catch (error: any) {
      console.error("Failed to save configuration:", error);
      res.status(500).json({ error: "Failed to save configuration", message: error.message });
    }
  });

  // ============================================
  // ZOHO MAILBOX PROVISIONING ENDPOINTS
  // ============================================

  // Create new mailbox via Zoho Admin API
  app.post("/api/email/create-mailbox", async (req, res) => {
    const { desiredEmail, customerName, userId } = req.body;

    if (!desiredEmail || !customerName) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    // Check if Zoho Admin API is configured
    if (!isZohoConfigured()) {
      return res.status(503).json({
        error: "Zoho Admin API not configured",
        message: "Please run setup commands to get refresh token and ZOID"
      });
    }

    try {
      // Generate secure initial password (16 chars)
      const initialPassword = crypto.randomBytes(12).toString('base64').slice(0, 16);

      // Create user in Zoho via Admin API
      const zohoResponse = await zohoAdmin.createUser({
        email: desiredEmail,
        password: initialPassword,
        firstName: customerName.split(' ')[0],
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        displayName: customerName,
      });

      console.log('Zoho mailbox created:', zohoResponse);

      // Save to Firebase (encrypted)
      let savedToDb = false;
      try {
        const { accountsService } = await import("./accounts");
        const userIdToUse = userId || req.headers['x-user-id'] as string || desiredEmail;

        await accountsService.addAccount(userIdToUse, {
          email: desiredEmail,
          password: initialPassword,
          provider: 'iam', // i.AM Mail Hosted (white-label)
          displayName: customerName,
          zohoAccountId: zohoResponse.data?.accountId || zohoResponse.accountId,
          createdViaIAM: true,
          isActive: true,
        });
        savedToDb = true;
      } catch (dbError) {
        console.error("Warning: Could not save to Firestore:", dbError);
      }

      return res.json({
        success: true,
        email: desiredEmail,
        tempPassword: initialPassword, // Show once, then customer should change
        message: "Email created successfully! Use Genesis Protocol to connect.",
        savedToDatabase: savedToDb,
      });

    } catch (error: any) {
      console.error("Mailbox creation failed:", error.response?.data || error.message);
      return res.status(500).json({
        error: "Failed to create mailbox",
        details: error.response?.data?.message || error.message,
      });
    }
  });

  // Change password via Zoho Admin API
  app.post("/api/email/change-password", async (req, res) => {
    const { accountId, currentPassword, newPassword, userId } = req.body;

    if (!accountId || !newPassword) {
      return res.status(400).json({ error: "Account ID and new password are required" });
    }

    try {
      const { accountsService } = await import("./accounts");
      const userIdToUse = userId || req.headers['x-user-id'] as string;

      if (!userIdToUse) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Get account from Firebase
      const accounts = await accountsService.getAccounts(userIdToUse);
      const account = accounts.find((a: any) => a.id === accountId);

      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }

      // Verify current password if provided
      if (currentPassword) {
        const storedPassword = await accountsService.getDecryptedPassword(accountId);
        if (storedPassword !== currentPassword) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
      }

      // Update in Zoho if it's a Zoho-hosted account
      if (account.zohoAccountId && isZohoConfigured()) {
        try {
          await zohoAdmin.updatePassword(account.zohoAccountId, newPassword);
          console.log("Password updated in Zoho");
        } catch (zohoError: any) {
          console.error("Failed to update Zoho password:", zohoError.response?.data || zohoError.message);
          // Continue - still update in Firebase
        }
      }

      // Update in Firebase
      await accountsService.updatePassword(userIdToUse, accountId, newPassword);

      return res.json({
        success: true,
        message: "Password updated successfully",
      });

    } catch (error: any) {
      console.error("Password change failed:", error);
      return res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Check Zoho Admin API status
  app.get("/api/zoho/status", async (req, res) => {
    res.json({
      configured: isZohoConfigured(),
      message: isZohoConfigured()
        ? "Zoho Admin API is ready for mailbox provisioning"
        : "Zoho Admin API needs configuration (run setup commands)",
    });
  });

  // Get all accounts for a user
  app.get("/api/accounts", async (req, res) => {
    try {
      // Try multiple sources for userId
      const userId = (req.query.userId as string) ||
        (req.headers['x-user-id'] as string) ||
        (req.query.email as string);

      if (!userId) {
        // Return empty array instead of error - no accounts configured yet
        return res.json([]);
      }

      const { accountsService } = await import("./accounts");

      // Auto-deduplicate on every fetch to clean up any existing duplicates
      await accountsService.deduplicateAccounts(userId);

      const accounts = await accountsService.getAccounts(userId);

      // Don't send passwords to client
      const sanitized = accounts.map(acc => ({
        id: acc.id,
        email: acc.email,
        provider: acc.provider,
        isActive: acc.isActive,
        createdAt: acc.createdAt
      }));

      res.json(sanitized);
    } catch (error: any) {
      console.error("Failed to fetch accounts:", error);
      // Return empty array on error instead of 500
      res.json([]);
    }
  });

  // Cleanup duplicate accounts
  app.post("/api/accounts/cleanup", async (req, res) => {
    try {
      const userId = req.body.userId || req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const { accountsService } = await import("./accounts");
      const result = await accountsService.deduplicateAccounts(userId);

      res.json({
        success: true,
        message: `Removed ${result.removed} duplicate accounts`,
        ...result
      });
    } catch (error: any) {
      console.error("Failed to cleanup accounts:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Switch active account
  app.post("/api/accounts/switch", async (req, res) => {
    try {
      const { userId, accountId } = req.body;
      if (!userId || !accountId) {
        return res.status(400).json({ error: "userId and accountId are required" });
      }

      const { accountsService } = await import("./accounts");
      await accountsService.setActiveAccount(userId, accountId);

      // Update process.env with new active account
      const activeAccount = await accountsService.getActiveAccount(userId);
      if (activeAccount) {
        const password = await accountsService.getDecryptedPassword(activeAccount.id);
        process.env.IMAP_HOST = activeAccount.imapHost;
        process.env.IMAP_PORT = String(activeAccount.imapPort);
        process.env.IMAP_USER = activeAccount.email;
        process.env.IMAP_PASS = password;
        process.env.SMTP_HOST = activeAccount.smtpHost;
        process.env.SMTP_PORT = String(activeAccount.smtpPort);
        process.env.SMTP_USER = activeAccount.email;
        process.env.SMTP_PASS = password;
      }

      res.json({ success: true, message: "Account switched successfully" });
    } catch (error: any) {
      console.error("Failed to switch account:", error);
      res.status(500).json({ error: "Failed to switch account" });
    }
  });

  // Delete account
  app.delete("/api/accounts/:accountId", async (req, res) => {
    try {
      const { accountId } = req.params;
      const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string);

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const { accountsService } = await import("./accounts");
      await accountsService.deleteAccount(userId, accountId);

      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      res.status(500).json({ error: "Failed to delete account" });
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

  // Get sent emails with tracking data
  app.get("/api/sent-emails", async (req, res) => {
    try {
      const sentEmails = await storage.getEmailsByFolder("sent");

      // Transform to include tracking info
      const emailsWithTracking = sentEmails.map((email: any) => {
        const isOpened = email.readCount && email.readCount > 0;
        const daysSinceSent = email.createdAt
          ? Math.floor((Date.now() - new Date(email.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        // Ghost detection: sent > 3 days ago but never opened
        const ghosted = !isOpened && daysSinceSent > 3;

        // Calculate impact score based on engagement
        let impactScore = 40; // Base score
        if (isOpened) impactScore += 30;
        if (email.readCount > 1) impactScore += Math.min(email.readCount * 5, 20);
        if (email.userAgent) impactScore += 10; // Has device info

        return {
          id: email.id,
          senderName: 'Me',
          senderEmail: email.senderEmail || email.sender || 'me@rayzen.ae',
          recipientEmail: email.recipientEmail || email.recipient || '',
          subject: email.subject,
          preview: email.preview || email.body?.slice(0, 100) || '',
          body: email.body,
          time: email.createdAt ? formatTimeAgo(new Date(email.createdAt)) : 'Recently',
          read: true,
          folder: 'sent',
          category: 'other',
          urgencyScore: 50,
          tracking: {
            isEnabled: !!email.trackingToken,
            status: isOpened ? 'opened' : 'delivered',
            openedAt: email.readAt ? formatTimeAgo(new Date(email.readAt)) : undefined,
            location: parseLocationFromIP(email.ip),
            device: parseDeviceFromUA(email.userAgent),
            impactScore: Math.min(impactScore, 100),
            ghosted,
            openCount: email.readCount || 0,
          }
        };
      });

      res.json(emailsWithTracking);
    } catch (error: any) {
      console.error("Failed to fetch sent emails:", error);
      res.status(500).json({ error: "Failed to fetch sent emails" });
    }
  });

  // Helper functions for tracking display
  function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  function parseLocationFromIP(ip: string | undefined): string | undefined {
    if (!ip) return undefined;
    // In production, you'd use an IP geolocation service
    // For now, return a placeholder
    if (ip.includes('127.0.0.1') || ip.includes('::1')) return 'Local';
    return 'Unknown Location';
  }

  function parseDeviceFromUA(ua: string | undefined): string | undefined {
    if (!ua) return undefined;
    if (ua.includes('iPhone')) return 'iPhone';
    if (ua.includes('iPad')) return 'iPad';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('Mac')) return 'Mac';
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Linux')) return 'Linux';
    return 'Unknown Device';
  }

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
    // Try to get user's configured email account first
    let imapHost: string = '', imapPort: number = 993, imapUser: string = '', imapPass: string = '';

    try {
      const accountsService = (await import('./accounts')).accountsService;
      const userId = req.query.userId as string || req.headers['x-user-id'] as string;

      if (userId) {
        const accounts = await accountsService.getAccounts(userId);
        const activeAccount = accounts.find((a: any) => a.isActive) || accounts[0];

        if (activeAccount) {
          // Use provider detection for IMAP settings
          const { config } = detectProvider(activeAccount.email);

          imapHost = activeAccount.imapHost || config.imap.host;
          imapPort = activeAccount.imapPort || config.imap.port;
          imapUser = activeAccount.email;
          imapPass = await accountsService.getDecryptedPassword(activeAccount.id);

          console.log(`Fetching emails for ${imapUser} via ${imapHost}:${imapPort} (${config.name})`);
        }
      }
    } catch (e) {
      console.log('No user account found, falling back to env vars');
    }

    // Fallback to environment variables
    if (!imapHost!) {
      const { IMAP_HOST, IMAP_USER, IMAP_PASS, IMAP_PORT } = process.env;

      if (!IMAP_HOST || !IMAP_USER || !IMAP_PASS) {
        return res.status(400).json({
          error: "No email account configured",
          message: "Please connect an email account in Settings first"
        });
      }

      imapHost = IMAP_HOST;
      imapPort = parseInt(IMAP_PORT || "993");
      imapUser = IMAP_USER;
      imapPass = IMAP_PASS;
    }

    const client = new ImapFlow({
      host: imapHost,
      port: imapPort,
      secure: true,
      auth: {
        user: imapUser,
        pass: imapPass,
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
    const { to, cc, bcc, subject, body, html } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: "Missing required fields: to, subject" });
    }

    // Try to get user's configured email account
    try {
      const accountsService = (await import('./accounts')).accountsService;

      // Get active account for user (use first active account)
      const userId = req.body.userId || req.headers['x-user-id'] || 'default';
      let activeAccount;

      try {
        const accounts = await accountsService.getAccounts(userId.toString());
        activeAccount = accounts.find((a: any) => a.isActive) || accounts[0];
      } catch (e) {
        // Try localStorage user email
        const userEmail = req.headers['x-user-email'] as string;
        if (userEmail) {
          const accounts = await accountsService.getAccounts(userEmail);
          activeAccount = accounts.find((a: any) => a.isActive) || accounts[0];
        }
      }

      if (!activeAccount) {
        // Fallback to environment variables if no account configured
        const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;

        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
          return res.status(400).json({
            error: "No email account configured",
            message: "Please connect an email account in Settings first"
          });
        }

        // Use env vars as fallback
        activeAccount = {
          email: SMTP_USER,
          smtpHost: SMTP_HOST,
          smtpPort: parseInt(SMTP_PORT || "587"),
          password: SMTP_PASS
        };
      }

      // Get decrypted password
      let smtpPassword = activeAccount.password;
      if (activeAccount.id) {
        // It's from Firestore, need to get decrypted version
        smtpPassword = await accountsService.getDecryptedPassword(activeAccount.id);
      }

      // Determine SMTP settings
      const smtpHost = activeAccount.smtpHost || activeAccount.imapHost?.replace('imap.', 'smtp.');
      const smtpPort = activeAccount.smtpPort || 587;

      console.log(`Sending email via ${smtpHost}:${smtpPort} from ${activeAccount.email}`);

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: activeAccount.email,
          pass: smtpPassword,
        },
      });

      const trackingToken = crypto.randomUUID();
      const baseUrl = process.env.BASE_URL || `https://${req.get("host")}`;
      const trackingPixel = `<img src="${baseUrl}/api/track?id=${trackingToken}" width="1" height="1" style="display:none" alt="" />`;
      const htmlBody = html || `<p>${(body || '').replace(/\n/g, "</p><p>")}</p>`;
      const htmlWithTracking = htmlBody + trackingPixel;

      const info = await transporter.sendMail({
        from: activeAccount.email,
        to,
        cc: cc || undefined,
        bcc: bcc || undefined,
        subject,
        text: body,
        html: htmlWithTracking,
      });

      await storage.createEmail({
        sender: "You",
        senderEmail: activeAccount.email,
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
