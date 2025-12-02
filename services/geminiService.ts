import { GoogleGenAI, Type } from "@google/genai";
import { CharacterData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCharacterData = async (character: string): Promise<CharacterData> => {
  if (!character || character.length === 0) {
    throw new Error("Character is required");
  }

  const cleanChar = character.charAt(0);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Provide detailed dictionary information for the Chinese character "${cleanChar}".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          char: { type: Type.STRING, description: "The character itself" },
          pinyin: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of pinyin pronunciations (e.g., ['wǒ'])"
          },
          definitions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of English definitions"
          },
          radical: { type: Type.STRING, description: "The radical of the character" },
          strokeCount: { type: Type.NUMBER, description: "Total number of strokes" },
          etymology: { type: Type.STRING, description: "Brief explanation of the character's origin or evolution (approx 30 words)" },
          difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chinese: { type: Type.STRING },
                pinyin: { type: Type.STRING },
                english: { type: Type.STRING }
              },
              required: ["chinese", "pinyin", "english"]
            },
            description: "3 common example sentences or phrases"
          }
        },
        required: ["char", "pinyin", "definitions", "radical", "strokeCount", "etymology", "examples", "difficulty"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to fetch data from Gemini");
  }

  return JSON.parse(response.text) as CharacterData;
};