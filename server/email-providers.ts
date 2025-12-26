// Email Providers Configuration
// Zoho is Priority #1 for i.AM Mail white-label partnership

export interface ProviderConfig {
    name: string;
    priority: number;
    imap: {
        host: string;
        port: number;
        secure: boolean;
    };
    smtp: {
        host: string;
        port: number;
        secure: boolean;
    };
    domains: string[];
    isWhiteLabel?: boolean;
}

export const EMAIL_PROVIDERS: Record<string, ProviderConfig> = {
    // PRIORITY #1 - i.AM Mail Hosted (fully white-labeled)
    iam: {
        name: 'i.AM Mail Hosted',
        priority: 1,
        imap: {
            host: process.env.IAM_MAIL_IMAP_HOST || 'mail.iammail.cloud', // Your branded domain
            port: 993,
            secure: true,
        },
        smtp: {
            host: process.env.IAM_MAIL_SMTP_HOST || 'smtp.iammail.cloud', // Your branded domain
            port: 465,
            secure: true,
        },
        // Add your customer domains here as they subscribe
        domains: ['iammail.cloud', 'iamrayzen.com', 'rayzen.ae'],
        isWhiteLabel: true,
    },

    // Gmail
    gmail: {
        name: 'Gmail',
        priority: 2,
        imap: {
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
        },
        smtp: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
        },
        domains: ['gmail.com', 'googlemail.com'],
    },

    // Outlook/Microsoft 365
    outlook: {
        name: 'Outlook / Microsoft 365',
        priority: 3,
        imap: {
            host: 'outlook.office365.com',
            port: 993,
            secure: true,
        },
        smtp: {
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // STARTTLS
        },
        domains: ['outlook.com', 'hotmail.com', 'live.com', 'microsoft.com'],
    },

    // iCloud
    icloud: {
        name: 'iCloud',
        priority: 4,
        imap: {
            host: 'imap.mail.me.com',
            port: 993,
            secure: true,
        },
        smtp: {
            host: 'smtp.mail.me.com',
            port: 587,
            secure: false,
        },
        domains: ['icloud.com', 'me.com', 'mac.com'],
    },

    // Titan Email
    titan: {
        name: 'Titan',
        priority: 5,
        imap: {
            host: 'imap.titan.email',
            port: 993,
            secure: true,
        },
        smtp: {
            host: 'smtp.titan.email',
            port: 587,
            secure: false,
        },
        domains: ['titan.email'],
    },

    // Custom/Self-hosted (fallback to Zoho for white-label)
    custom: {
        name: 'Custom',
        priority: 99,
        imap: {
            host: '',
            port: 993,
            secure: true,
        },
        smtp: {
            host: '',
            port: 587,
            secure: false,
        },
        domains: [],
    },
};

// Auto-detect provider from email domain
export function detectProvider(email: string): { key: string; config: ProviderConfig } {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
        return { key: 'custom', config: EMAIL_PROVIDERS.custom };
    }

    // Check known provider domains
    for (const [key, config] of Object.entries(EMAIL_PROVIDERS)) {
        if (config.domains.includes(domain)) {
            return { key, config };
        }
    }

    // For unknown/custom domains, default to i.AM Mail (Zoho infrastructure, white-labeled)
    // This means any custom domain email will use i.AM Mail hosted settings
    console.log(`Unknown domain ${domain}, defaulting to i.AM Mail Hosted`);
    return { key: 'iam', config: EMAIL_PROVIDERS.iam };
}

// Get provider by key
export function getProvider(key: string): ProviderConfig {
    return EMAIL_PROVIDERS[key] || EMAIL_PROVIDERS.custom;
}

// Get all providers sorted by priority
export function getProvidersList(): Array<{ key: string; config: ProviderConfig }> {
    return Object.entries(EMAIL_PROVIDERS)
        .map(([key, config]) => ({ key, config }))
        .sort((a, b) => a.config.priority - b.config.priority);
}
