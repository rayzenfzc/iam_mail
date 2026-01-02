
import { GoogleGenAI } from "@google/genai";
import { Email } from "../types";

export class GeminiService {
  async searchEmails(query: string, emails: Email[]): Promise<string> {
    // Initializing Gemini with correct parameter and model per instructions
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const context = emails.map(e => `From: ${e.sender}, Subject: ${e.subject}, Content: ${e.preview}`).join("\n---\n");
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the following emails:\n${context}\n\nUser Question: ${query}\n\nAnswer the user question concisely based only on the emails provided.`,
      });
      // Accessing response.text as a property as per guidelines
      return response.text || "No results found.";
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return "I encountered an error while searching your emails.";
    }
  }
}