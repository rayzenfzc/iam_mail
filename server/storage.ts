import { type User, type InsertUser, type Email, type InsertEmail, type Comment, type InsertComment, type Snippet, type InsertSnippet } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getEmails(): Promise<Email[]>;
  getEmailsByFolder(folder: string): Promise<Email[]>;
  getEmail(id: string): Promise<Email | undefined>;
  getEmailByTrackingToken(token: string): Promise<Email | undefined>;
  createEmail(email: InsertEmail): Promise<Email>;
  updateEmail(id: string, updates: Partial<Email>): Promise<Email | undefined>;
  
  getCommentsByEmail(emailId: string): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  getSnippets(): Promise<Snippet[]>;
  createSnippet(snippet: InsertSnippet): Promise<Snippet>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private emails: Map<string, Email>;
  private comments: Map<string, Comment>;
  private snippets: Map<string, Snippet>;

  constructor() {
    this.users = new Map();
    this.emails = new Map();
    this.comments = new Map();
    this.snippets = new Map();
    this.seedMockData();
  }

  private seedMockData() {
    const mockEmails: Email[] = [
      {
        id: "1",
        sender: "Sarah Chen",
        senderEmail: "sarah.chen@techcorp.com",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Q4 Partnership Proposal - Ready for Review",
        body: `<p>Hi there,</p><p>I hope this email finds you well. I wanted to follow up on our conversation from last week about the Q4 partnership opportunity.</p><p>We've prepared a comprehensive proposal that outlines the key deliverables, timeline, and pricing structure. I believe this could be a fantastic opportunity for both our organizations.</p><p>Key highlights:</p><ul><li>30% increase in lead generation capacity</li><li>Dedicated account management team</li><li>Quarterly business reviews</li><li>Priority support access</li></ul><p>Would you have time for a 30-minute call this week to discuss the details?</p><p>Best regards,<br/>Sarah</p>`,
        preview: "I hope this email finds you well. I wanted to follow up on our conversation...",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false,
        isStarred: true,
        folder: "inbox",
        category: "focus",
        isOnline: true,
        hasQuoteOpen: true,
        summary: "Partnership proposal for Q4 with 30% lead generation increase, dedicated account management, quarterly reviews, and priority support. Requests a 30-minute call this week.",
        trackingToken: null,
        readAt: null,
      },
      {
        id: "2",
        sender: "Marcus Johnson",
        senderEmail: "marcus.j@globalventures.io",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Re: Contract Renewal Discussion",
        body: `<p>Good morning,</p><p>Thank you for sending over the renewal terms. Our legal team has reviewed the contract and we have a few questions about the service level agreements.</p><p>Could you clarify the response time guarantees for Tier 1 support tickets? We need to ensure alignment with our internal SLAs before we can proceed.</p><p>Looking forward to your response.</p><p>Marcus</p>`,
        preview: "Thank you for sending over the renewal terms. Our legal team has reviewed...",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: true,
        hasQuoteOpen: false,
        summary: "Legal team reviewed contract renewal. Needs clarification on Tier 1 support response time guarantees to align with their internal SLAs.",
        trackingToken: null,
        readAt: null,
      },
      {
        id: "3",
        sender: "Emily Rodriguez",
        senderEmail: "e.rodriguez@innovate.co",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Demo Request - Enterprise Solution",
        body: `<p>Hello,</p><p>I came across your platform while researching solutions for our enterprise needs. We're a 500+ employee company looking to streamline our sales operations.</p><p>Would it be possible to schedule a demo of your enterprise features? We're particularly interested in:</p><ul><li>Multi-team collaboration</li><li>Advanced analytics dashboard</li><li>API integrations</li><li>Custom workflow automation</li></ul><p>Our team is available next week if that works for you.</p><p>Thanks,<br/>Emily</p>`,
        preview: "I came across your platform while researching solutions for our enterprise...",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: false,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "4",
        sender: "David Kim",
        senderEmail: "david.kim@nextstep.ventures",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Investment Opportunity Discussion",
        body: `<p>Dear Team,</p><p>NextStep Ventures has been following your company's growth trajectory with great interest. We believe there's a strong alignment between your vision and our investment thesis.</p><p>We'd love to explore potential partnership or investment opportunities. Our fund focuses on Series A and B rounds for high-growth SaaS companies.</p><p>Would you be open to an introductory call?</p><p>Best,<br/>David Kim<br/>Partner, NextStep Ventures</p>`,
        preview: "NextStep Ventures has been following your company's growth trajectory...",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        isStarred: true,
        folder: "inbox",
        category: "focus",
        isOnline: false,
        hasQuoteOpen: false,
        summary: "NextStep Ventures interested in Series A/B investment opportunity. Requests introductory call to discuss partnership.",
        trackingToken: null,
        readAt: null,
      },
      {
        id: "5",
        sender: "Lisa Thompson",
        senderEmail: "lisa.t@acmecorp.com",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Urgent: Payment Issue Resolved",
        body: `<p>Hi,</p><p>Great news! I wanted to let you know that the payment issue we discussed has been resolved. Our finance team processed the outstanding invoice this morning.</p><p>The payment should reflect in your account within 2-3 business days. Please confirm once you receive it.</p><p>Apologies for any inconvenience caused.</p><p>Best regards,<br/>Lisa</p>`,
        preview: "Great news! I wanted to let you know that the payment issue we discussed...",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: true,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "6",
        sender: "Newsletter",
        senderEmail: "updates@industryweekly.com",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "This Week in Tech: AI Revolution Continues",
        body: `<p>Your weekly digest of the latest in technology and business.</p><p>Top stories this week:</p><ul><li>Major tech companies announce new AI initiatives</li><li>Remote work trends continue to evolve</li><li>Startup funding reaches new highs</li></ul>`,
        preview: "Your weekly digest of the latest in technology and business...",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "other",
        isOnline: false,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "7",
        sender: "HR Team",
        senderEmail: "hr@company.com",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Reminder: Benefits Enrollment Deadline",
        body: `<p>Hi Team,</p><p>This is a friendly reminder that the annual benefits enrollment period ends on Friday. Please make sure to review and update your selections.</p><p>If you have any questions, reach out to HR.</p>`,
        preview: "This is a friendly reminder that the annual benefits enrollment period...",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "other",
        isOnline: false,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "8",
        sender: "Alex Wong",
        senderEmail: "alex.wong@prospects.net",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Following Up - Product Demo",
        body: `<p>Hi,</p><p>I wanted to follow up on the demo we had last week. Has your team had a chance to discuss the proposal?</p><p>I'm happy to answer any additional questions or provide more information.</p><p>Best,<br/>Alex</p>`,
        preview: "I wanted to follow up on the demo we had last week. Has your team...",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: false,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: false,
        hasQuoteOpen: true,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "9",
        sender: "Jennifer Lee",
        senderEmail: "jlee@enterprise.io",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Re: Integration Requirements",
        body: `<p>Thanks for the detailed specifications. Our development team has reviewed them and everything looks good.</p><p>We can start the integration next week. I'll send over the API credentials shortly.</p><p>Jennifer</p>`,
        preview: "Thanks for the detailed specifications. Our development team has reviewed...",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: true,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
      {
        id: "10",
        sender: "Michael Brown",
        senderEmail: "mbrown@startup.co",
        senderAvatar: null,
        recipient: "You",
        recipientEmail: "you@company.com",
        subject: "Partnership Opportunity",
        body: `<p>Hello,</p><p>I represent a fast-growing startup in the fintech space. We've been impressed with your platform and see potential synergies between our solutions.</p><p>Would you be interested in exploring a strategic partnership?</p><p>Best regards,<br/>Michael</p>`,
        preview: "I represent a fast-growing startup in the fintech space. We've been impressed...",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRead: true,
        isStarred: false,
        folder: "inbox",
        category: "focus",
        isOnline: false,
        hasQuoteOpen: false,
        summary: null,
        trackingToken: null,
        readAt: null,
      },
    ];

    mockEmails.forEach((email) => this.emails.set(email.id, email));
    
    const defaultSnippets: Snippet[] = [
      { id: "s1", title: "Intro", shortcut: "intro", body: "Hi there,\n\nI hope this email finds you well. I wanted to reach out regarding..." },
      { id: "s2", title: "Follow Up", shortcut: "followup", body: "I wanted to follow up on my previous email. Have you had a chance to review the information I sent?" },
      { id: "s3", title: "Thanks", shortcut: "thanks", body: "Thank you for your time and consideration. Please let me know if you have any questions." },
      { id: "s4", title: "Meeting Request", shortcut: "meeting", body: "Would you be available for a quick call this week? I'd love to discuss this further with you." },
      { id: "s5", title: "Closing", shortcut: "close", body: "Best regards,\n\nLooking forward to hearing from you." },
    ];
    defaultSnippets.forEach((s) => this.snippets.set(s.id, s));

    const mockComments: Comment[] = [
      {
        id: "c1",
        emailId: "1",
        author: "John",
        authorAvatar: null,
        content: "@Team Can we offer a 15% discount here?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: "c2",
        emailId: "1",
        author: "Amy",
        authorAvatar: null,
        content: "Yes, approved up to 20% for enterprise deals",
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
      },
      {
        id: "c3",
        emailId: "2",
        author: "John",
        authorAvatar: null,
        content: "Legal needs to review this before we respond",
        timestamp: new Date(Date.now() - 35 * 60 * 1000),
      },
    ];

    mockComments.forEach((comment) => this.comments.set(comment.id, comment));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEmails(): Promise<Email[]> {
    return Array.from(this.emails.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getEmailsByFolder(folder: string): Promise<Email[]> {
    const emails = await this.getEmails();
    return emails.filter((e) => e.folder === folder);
  }

  async getEmail(id: string): Promise<Email | undefined> {
    return this.emails.get(id);
  }

  async getEmailByTrackingToken(token: string): Promise<Email | undefined> {
    return Array.from(this.emails.values()).find((e) => e.trackingToken === token);
  }

  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const id = randomUUID();
    const email: Email = {
      id,
      timestamp: new Date(),
      sender: insertEmail.sender,
      senderEmail: insertEmail.senderEmail,
      senderAvatar: insertEmail.senderAvatar ?? null,
      recipient: insertEmail.recipient,
      recipientEmail: insertEmail.recipientEmail,
      subject: insertEmail.subject,
      body: insertEmail.body,
      preview: insertEmail.preview,
      isRead: insertEmail.isRead ?? false,
      isStarred: insertEmail.isStarred ?? false,
      folder: insertEmail.folder ?? "inbox",
      category: insertEmail.category ?? "focus",
      isOnline: insertEmail.isOnline ?? false,
      hasQuoteOpen: insertEmail.hasQuoteOpen ?? false,
      summary: insertEmail.summary ?? null,
      trackingToken: insertEmail.trackingToken ?? null,
      readAt: insertEmail.readAt ?? null,
    };
    this.emails.set(id, email);
    return email;
  }

  async updateEmail(id: string, updates: Partial<Email>): Promise<Email | undefined> {
    const email = this.emails.get(id);
    if (!email) return undefined;
    const updated = { ...email, ...updates };
    this.emails.set(id, updated);
    return updated;
  }

  async getCommentsByEmail(emailId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((c) => c.emailId === emailId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = randomUUID();
    const comment: Comment = {
      ...insertComment,
      id,
      timestamp: new Date(),
      authorAvatar: insertComment.authorAvatar ?? null,
    };
    this.comments.set(id, comment);
    return comment;
  }

  async getSnippets(): Promise<Snippet[]> {
    return Array.from(this.snippets.values());
  }

  async createSnippet(insertSnippet: InsertSnippet): Promise<Snippet> {
    const id = randomUUID();
    const snippet: Snippet = { ...insertSnippet, id };
    this.snippets.set(id, snippet);
    return snippet;
  }
}

export const storage = new MemStorage();
