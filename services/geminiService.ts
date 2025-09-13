import type { ResumeData, AIFeedbackData } from '../types';
import { Type, GenerateContentResponse } from "@google/genai";

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocal ? 'http://localhost:3000/api' : '/api';


async function generateContent(model: string, contents: any, config = {}): Promise<GenerateContentResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, contents, config }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}


const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "An overall score from 0-100 for the resume based on the target job."
        },
        strengths: {
            type: Type.ARRAY,
            description: "A list of 2-3 key strengths of the resume.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, bold title for the strength." },
                    description: { type: Type.STRING, description: "A 1-2 sentence explanation of the strength." }
                },
                required: ['title', 'description']
            }
        },
        suggestions: {
            type: Type.ARRAY,
            description: "A list of 2-3 actionable suggestions for improvement.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, bold title for the suggestion." },
                    description: { type: Type.STRING, description: "A 1-2 sentence explanation of what to improve." },
                    suggestedChange: { type: Type.STRING, description: "Optional. If the suggestion is about the summary, provide a rewritten, improved version of the summary."}
                },
                required: ['title', 'description']
            }
        }
    },
    required: ['score', 'strengths', 'suggestions']
};


export const getResumeFeedback = async (resumeData: ResumeData, targetJob: string): Promise<AIFeedbackData> => {
    try {
        const prompt = `
            Analyze the following resume data for a candidate targeting a "${targetJob}" position. 
            Provide a score from 0-100 on how well it fits the role. 
            Also, provide 2-3 strengths and 2-3 actionable suggestions for improvement.
            If the professional summary can be improved, provide a rewritten version as a 'suggestedChange'.
            Resume Data: ${JSON.stringify(resumeData)}
        `;

        const response = await generateContent("gemini-2.5-flash", prompt, {
            responseMimeType: "application/json",
            responseSchema: feedbackSchema,
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIFeedbackData;

    } catch (error) {
        console.error("Error getting resume feedback:", error);
        throw new Error('AI analysis failed. This could be a temporary issue with the server, please try again.');
    }
};

export const enhanceBulletPoint = async (point: string): Promise<string> => {
    try {
        const prompt = `
            Enhance this resume bullet point to be more impactful and action-oriented. 
            Use the STAR (Situation, Task, Action, Result) method if possible and include quantifiable results.
            Keep it as a single sentence.
            Original point: "${point}"
        `;
        const response = await generateContent("gemini-2.5-flash", prompt);
        return response.text.trim().replace(/^"|"$/g, ''); // Remove quotes if AI adds them
    } catch (error) {
        console.error("Error enhancing bullet point:", error);
        throw new Error('Failed to enhance bullet point with AI. Please try again.');
    }
};

export const generateSummary = async (resumeData: ResumeData): Promise<string> => {
    try {
        const prompt = `
            Based on the following resume data, write a professional, compelling summary of 2-4 sentences.
            Highlight the key skills and experiences relevant to a senior professional role.
            Resume Data: ${JSON.stringify(resumeData)}
        `;
        const response = await generateContent("gemini-2.5-flash", prompt);
        return response.text.trim();
    } catch (error) {
        console.error("Error generating summary:", error);
        throw new Error('Failed to generate summary with AI. Please try again.');
    }
};

export const suggestJobTitles = async (resumeData: ResumeData): Promise<string[]> => {
    try {
        const prompt = `
            Based on the skills and experience in this resume, suggest 3 to 5 relevant and specific job titles.
            Return ONLY a comma-separated list of the titles.
            Resume Data: ${JSON.stringify(resumeData)}
        `;
        const response = await generateContent("gemini-2.5-flash", prompt);
        return response.text.trim().split(',').map(title => title.trim());
    } catch (error) {
        console.error("Error suggesting job titles:", error);
        throw new Error('Failed to suggest job titles with AI. Please try again.');
    }
}