import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function extractMetadata(title: string, description: string, subject: string) {
  const prompt = `
    Analyze the following academic resource details and generate a concise summary (max 200 characters) and 5 relevant keywords.
    Format the output as JSON: { "summary": "...", "keywords": ["...", "..."] }
    
    Title: ${title}
    Subject: ${subject}
    Description: ${description}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean JSON from markdown if exists
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return {
      summary: "Academic resource shared by the community.",
      keywords: [subject, "Notes", "UIT Prayagraj"]
    };
  }
}
export async function analyzeImage(base64Image: string) {
  const prompt = `
    Perform OCR on this image. Extract the Subject Name, Academic Year, and Topic.
    Also generate a concise summary and 5 keywords for this content.
    Format the output as JSON: { "subject": "...", "year": "...", "title": "...", "summary": "...", "keywords": ["..."] }
  `;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image.split(",")[1] || base64Image,
          mimeType: "image/jpeg"
        }
      }
    ]);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini OCR error:", error);
    return null;
  }
}
