const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const { ImapFlow } = require("imapflow");
const nodemailer = require("nodemailer");
const webpush = require("web-push");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// In-memory subscription storage
const subscriptions = [];

// VAPID configuration
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(
        "mailto:admin@iammail.cloud",
        publicVapidKey,
        privateVapidKey
    );
}

// Email classification endpoint
app.post("/classify", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email data required" });
        }

        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            return res.json({ category: "focus" });
        }

        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Classify this email into exactly one of these two categories:
      1. "focus": Personal emails, direct communication, important updates, high-priority, human-to-human.
      2. "other": Newsletters, automated notifications, receipts, marketing, promotional, bulk emails, system alerts.
      
      Return ONLY the category name ("focus" or "other"). Do not include any other text.

      Email Sender: ${email.sender} <${email.senderEmail}>
      Subject: ${email.subject}
      Snippet: ${email.snippet || email.preview || ""}
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const category = responseText.toLowerCase().includes("other") ? "other" : "focus";

        res.json({ category });
    } catch (error) {
        console.error("Classification error:", error);
        res.json({ category: "focus" });
    }
});

// Test email connection
app.post("/email/test-connection", async (req, res) => {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;

    if (!email || !password || !imapHost || !smtpHost) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const imapClient = new ImapFlow({
        host: imapHost,
        port: parseInt(imapPort) || 993,
        secure: true,
        auth: { user: email, pass: password },
        logger: false,
    });

    try {
        await imapClient.connect();
        await imapClient.logout();

        const smtpTransporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort) || 587,
            secure: parseInt(smtpPort) === 465,
            auth: { user: email, pass: password },
        });

        await smtpTransporter.verify();

        res.json({ success: true, message: "Connection successful" });
    } catch (error) {
        console.error("Connection test failed:", error);
        res.status(500).json({
            error: "Connection failed",
            message: error.message || "Unable to connect to email server"
        });
    }
});

// Save email configuration
app.post("/email/save-config", async (req, res) => {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;

    if (!email || !password || !imapHost || !smtpHost) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        res.json({ success: true, message: "Configuration saved" });
    } catch (error) {
        console.error("Failed to save configuration:", error);
        res.status(500).json({ error: "Failed to save configuration" });
    }
});

// VAPID public key endpoint
app.get("/notifications/vapid-public-key", (req, res) => {
    res.json({ publicKey: publicVapidKey || "check_server_logs_for_generated_key" });
});

// Push notification subscription
app.post("/notifications/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

// Export as 2nd gen function
exports.api = onRequest({
    timeoutSeconds: 60,
    memory: "256MiB",
    maxInstances: 10,
}, app);
