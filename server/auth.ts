import { db } from './firebase';
import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_EXPIRY = '7d'; // 7 days

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    lastLoginAt: Date;
    preferences: {
        theme: 'titanium' | 'onyx' | 'indigo' | 'bronze';
        darkMode: boolean;
        notifications: boolean;
    };
}

export interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

// Password hashing
function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + JWT_SECRET).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

// JWT operations
export function generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

export class AuthService {
    private collection = db.collection('users');

    async signup(email: string, password: string): Promise<{ user: User; token: string }> {
        // Check if user exists
        const existing = await this.getUserByEmail(email);
        if (existing) {
            throw new Error('User already exists');
        }

        const passwordHash = hashPassword(password);
        const userId = crypto.randomUUID();

        const user: Omit<User, 'id'> = {
            email,
            passwordHash,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            preferences: {
                theme: 'titanium',
                darkMode: false,
                notifications: true
            }
        };

        await this.collection.doc(userId).set(user);
        const token = generateToken(userId, email);

        return { user: { id: userId, ...user }, token };
    }

    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (!verifyPassword(password, user.passwordHash)) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        await this.collection.doc(user.id).update({ lastLoginAt: new Date() });

        const token = generateToken(user.id, user.email);
        return { user, token };
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const snapshot = await this.collection.where('email', '==', email).limit(1).get();
        if (snapshot.empty) return null;

        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() as Omit<User, 'id'> };
    }

    async getUserById(userId: string): Promise<User | null> {
        const doc = await this.collection.doc(userId).get();
        if (!doc.exists) return null;

        return { id: doc.id, ...doc.data() as Omit<User, 'id'> };
    }

    async updatePreferences(userId: string, preferences: Partial<User['preferences']>): Promise<void> {
        const user = await this.getUserById(userId);
        if (!user) throw new Error('User not found');

        await this.collection.doc(userId).update({
            preferences: { ...user.preferences, ...preferences }
        });
    }

    // Genesis Protocol - Connect email account
    async connectEmailAccount(
        userId: string,
        email: string,
        password: string,
        imapHost: string,
        imapPort: number,
        smtpHost: string,
        smtpPort: number
    ): Promise<{ success: boolean; message: string }> {
        try {
            const { accountsService } = await import('./accounts');

            // Create account in Firestore
            await accountsService.createAccount(userId, {
                email,
                password,
                imapHost,
                imapPort,
                smtpHost,
                smtpPort
            });

            // Set as active account
            const accounts = await accountsService.getAccounts(userId);
            const newAccount = accounts.find(acc => acc.email === email);
            if (newAccount) {
                await accountsService.setActiveAccount(userId, newAccount.id);
            }

            return { success: true, message: 'Account connected successfully' };
        } catch (error: any) {
            throw new Error(`Failed to connect account: ${error.message}`);
        }
    }
}

export const authService = new AuthService();
