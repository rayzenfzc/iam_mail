/**
 * Zoho Service - Frontend API calls for Zoho Admin operations
 */

const API_URL = import.meta.env.VITE_API_URL || '';

export interface ZohoStatus {
    configured: boolean;
    organizationId?: string;
    features?: string[];
    message?: string;
}

export interface ProvisionMailboxData {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    displayName?: string;
}

export interface ProvisionMailboxResponse {
    success: boolean;
    message: string;
    accountId?: string;
    email?: string;
}

/**
 * Check if Zoho Admin API is configured on the backend
 */
export async function checkZohoStatus(): Promise<ZohoStatus> {
    try {
        const response = await fetch(`${API_URL}/api/zoho/status`);

        if (!response.ok) {
            throw new Error('Failed to check Zoho status');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to check Zoho status:', error);
        return {
            configured: false,
            message: 'Unable to connect to Zoho service'
        };
    }
}

/**
 * Provision a new Zoho mailbox
 */
export async function provisionMailbox(data: ProvisionMailboxData): Promise<ProvisionMailboxResponse> {
    try {
        const response = await fetch(`${API_URL}/api/zoho/provision`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to provision mailbox');
        }

        return result;
    } catch (error: any) {
        console.error('Failed to provision mailbox:', error);
        return {
            success: false,
            message: error.message || 'Failed to provision mailbox'
        };
    }
}

/**
 * Get list of Zoho organization users
 */
export async function getZohoUsers(): Promise<any[]> {
    try {
        const response = await fetch(`${API_URL}/api/zoho/users`);

        if (!response.ok) {
            throw new Error('Failed to fetch Zoho users');
        }

        const data = await response.json();
        return data.data?.accounts || [];
    } catch (error) {
        console.error('Failed to fetch Zoho users:', error);
        return [];
    }
}

/**
 * Update Zoho user password
 */
export async function updateZohoPassword(accountId: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(`${API_URL}/api/zoho/users/${accountId}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to update password');
        }

        return result;
    } catch (error: any) {
        console.error('Failed to update password:', error);
        return {
            success: false,
            message: error.message || 'Failed to update password'
        };
    }
}

/**
 * Detect if an email domain is a Zoho/i.AM Mail domain
 */
export function isZohoDomain(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    const zohoDomains = ['iammail.cloud', 'iamrayzen.com', 'rayzen.ae'];
    return zohoDomains.includes(domain);
}

/**
 * Get provider name for display
 */
export function getProviderName(email: string): string {
    if (isZohoDomain(email)) {
        return 'i.AM Mail Hosted';
    }

    const domain = email.split('@')[1]?.toLowerCase();

    if (domain?.includes('gmail')) return 'Gmail';
    if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live')) return 'Outlook';
    if (domain?.includes('icloud') || domain?.includes('me.com')) return 'iCloud';
    if (domain?.includes('yahoo')) return 'Yahoo';

    return 'Custom Provider';
}
