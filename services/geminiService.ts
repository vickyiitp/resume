
import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData, AIFeedbackData } from '../types';

// FIX: Initialize the GoogleGenAI client using the API_KEY from environment variables, as per coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });


const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "A score from 0 to 100 evaluating the resume's fit for the target job.",
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 key strengths of the resume.",
        },
        improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 specific, actionable improvements for the resume.",
        },
        overallSummary: {
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the feedback."
        },
    },
    required: ["score", "strengths", "improvements", "overallSummary"],
};

export const getResumeFeedback = async (
    resumeData: ResumeData,
    targetJob: string
): Promise<AIFeedbackData> => {
    const prompt = `
        Act as an expert HR manager and a helpful, encouraging career coach.
        Your tone should be professional, constructive, and positive.
        Analyze the following resume data for a candidate applying for the role of "${targetJob}".
        Provide a critical evaluation and actionable feedback.
        
        Resume Data:
        ${JSON.stringify(resumeData, null, 2)}
        
        Your analysis should result in a score out of 100, and lists of strengths and areas for improvement.
        Focus on clarity, impact, and relevance to the target job.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: feedbackSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const feedback = JSON.parse(jsonText);
        
        return feedback as AIFeedbackData;

    } catch (error) {
        // FIX: Removed user-facing alerts for API key errors to comply with guidelines.
        console.error("Error getting feedback from Gemini API:", error);
        throw new Error("Failed to analyze resume. The AI service may be unavailable or the request failed.");
    }
};

export const enhanceBulletPoint = async (bulletPoint: string): Promise<string> => {
    if (!bulletPoint.trim()) {
        return bulletPoint;
    }

    const prompt = `
        As a professional resume writer, rewrite the following bullet point to be more impactful and professional.
        Use strong action verbs, quantify results where possible, and ensure it is concise.
        Return only the single, rewritten bullet point as a string, with no extra text or quotation marks.

        Original bullet point: "${bulletPoint}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
         // FIX: Removed user-facing alerts for API key errors to comply with guidelines.
        console.error("Error enhancing bullet point:", error);
        return bulletPoint; // Return original on error
    }
};
