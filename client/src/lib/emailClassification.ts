// Utility to classify emails using the backend AI endpoint
export async function classifyEmail(email: any): Promise<'focus' | 'other'> {
    try {
        const response = await fetch('/api/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            console.error('Classification failed, defaulting to focus');
            return 'focus';
        }

        const data = await response.json();
        return data.category || 'focus';
    } catch (error) {
        console.error('Classification error:', error);
        return 'focus'; // Default to focus on error
    }
}

// Batch classify multiple emails
export async function classifyEmails(emails: any[]): Promise<Map<string, 'focus' | 'other'>> {
    const results = new Map<string, 'focus' | 'other'>();

    // Process in parallel but limit concurrency
    const batchSize = 5;
    for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const classifications = await Promise.all(
            batch.map(async (email) => ({
                id: email.id,
                category: await classifyEmail(email)
            }))
        );

        classifications.forEach(({ id, category }) => {
            results.set(id, category);
        });
    }

    return results;
}
