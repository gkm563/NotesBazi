"use server";

import { analyzeImage } from "@/lib/gemini";

export async function getAIModelData(base64Image: string) {
  try {
    return await analyzeImage(base64Image);
  } catch (error) {
    console.error("AI Action Error:", error);
    return null;
  }
}
