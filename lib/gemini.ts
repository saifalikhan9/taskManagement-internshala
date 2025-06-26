import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function gemini(Topic: string) {
  const prompt = `Generate a JSON object that contains a 'heading', a 'tag' (like "learning", "travel", etc.), and exactly 5 tasks under the key 'tasks'. Each task should be an object with 'text' and 'completed' (default false). Return ONLY valid JSON in the form of string so that i can use JSON.parse method to convert it — no explanation, no markdown formatting, no backticks. The topic is: ${Topic}`;

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: { role: "user", parts: [{ text: prompt }] },
  });

  const response = result.text;
  if (!response) {
    console.error("Gemini API returned an empty response.");
    return null;
  }
  let jsonString = response.trim();
  if (jsonString.startsWith("```json")) {
    jsonString = jsonString.substring(7); // Remove '```json' (7 characters)
  }
  if (jsonString.endsWith("```")) {
    jsonString = jsonString.substring(0, jsonString.length - 3); // Remove '```' (3 characters)
  }

  // Trim again in case there's extra whitespace after stripping fences
  jsonString = jsonString.trim();

  console.log("Raw response from Gemini:", response);
  console.log("Cleaned JSON string (before parse):", jsonString);

  // Step 2: Attempt to parse the cleaned string
  const parsedJson = JSON.parse(jsonString);
  console.log("Successfully parsed JSON:", parsedJson);

  return parsedJson; // Return the parsed JavaScript object
}

export default gemini;
