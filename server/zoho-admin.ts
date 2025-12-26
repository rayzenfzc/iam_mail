/**
 * Zoho Admin Service
 * Handles automated mailbox provisioning via Zoho Mail Admin API
 * 
 * Features:
 * - Create mailboxes for customers
 * - Update passwords
 * - Delete mailboxes
 * - Auto-refresh OAuth tokens
 */

import axios from 'axios';

const ZOHO_API_BASE = 'https://mail.zoho.com/api';
const ZOHO_AUTH_BASE = 'https://accounts.zoho.com/oauth/v2';

interface ZohoConfig {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    zoid: string;
}

interface CreateUserParams {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    displayName?: string;
}

export class ZohoAdminService {
    private config: ZohoConfig;
    private accessToken: string | null = null;
    private tokenExpiry: number = 0;

    constructor(config: ZohoConfig) {
        this.config = config;
    }

    // Check if service is properly configured
    isConfigured(): boolean {
        return !!(
            this.config.clientId &&
            this.config.clientSecret &&
            this.config.refreshToken &&
            this.config.zoid &&
            this.config.refreshToken !== 'PENDING' &&
            this.config.zoid !== 'PENDING'
        );
    }

    // Auto-refresh access token when expired
    private async getAccessToken(): Promise<string> {
        if (!this.isConfigured()) {
            throw new Error('Zoho Admin API not configured. Run setup commands first.');
        }

        const now = Date.now();

        if (this.accessToken && this.tokenExpiry > now) {
            return this.accessToken;
        }

        console.log('Refreshing Zoho access token...');

        const response = await axios.post(`${ZOHO_AUTH_BASE}/token`, null, {
            params: {
                grant_type: 'refresh_token',
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                refresh_token: this.config.refreshToken,
            },
        });

        this.accessToken = response.data.access_token;
        this.tokenExpiry = now + (response.data.expires_in * 1000) - 60000; // 1 min buffer

        console.log('Zoho access token refreshed successfully');
        return this.accessToken!;
    }

    // Create new mailbox
    async createUser(userData: CreateUserParams): Promise<any> {
        const token = await this.getAccessToken();

        console.log(`Creating Zoho mailbox for: ${userData.email}`);

        const response = await axios.post(
            `${ZOHO_API_BASE}/organization/${this.config.zoid}/accounts`,
            {
                primaryEmailAddress: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName || '',
                displayName: userData.displayName || userData.firstName,
                role: 'member',
                country: 'ae',
                language: 'en',
                timeZone: 'Asia/Dubai',
            },
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Zoho mailbox created:', response.data);
        return response.data;
    }

    // Update user password
    async updatePassword(accountId: string, newPassword: string): Promise<any> {
        const token = await this.getAccessToken();

        console.log(`Updating password for Zoho account: ${accountId}`);

        const response = await axios.put(
            `${ZOHO_API_BASE}/organization/${this.config.zoid}/accounts/${accountId}`,
            { password: newPassword },
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data;
    }

    // Delete user mailbox
    async deleteUser(accountId: string): Promise<any> {
        const token = await this.getAccessToken();

        console.log(`Deleting Zoho account: ${accountId}`);

        const response = await axios.delete(
            `${ZOHO_API_BASE}/organization/${this.config.zoid}/accounts/${accountId}`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                },
            }
        );

        return response.data;
    }

    // Get all users in organization
    async listUsers(): Promise<any> {
        const token = await this.getAccessToken();

        const response = await axios.get(
            `${ZOHO_API_BASE}/organization/${this.config.zoid}/accounts`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                },
            }
        );

        return response.data;
    }

    // Get user by email
    async getUserByEmail(email: string): Promise<any> {
        const token = await this.getAccessToken();

        const response = await axios.get(
            `${ZOHO_API_BASE}/organization/${this.config.zoid}/accounts`,
            {
                params: { searchString: email },
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                },
            }
        );

        return response.data;
    }
}

// Export singleton instance
export const zohoAdmin = new ZohoAdminService({
    clientId: process.env.ZOHO_CLIENT_ID || '',
    clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
    zoid: process.env.ZOHO_ZOID || '',
});

// Helper to check if Zoho is configured
export function isZohoConfigured(): boolean {
    return zohoAdmin.isConfigured();
}
