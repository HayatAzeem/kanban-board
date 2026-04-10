"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResumeSuggestions = exports.parseJobDescription = void 0;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const parseJobDescription = (jobDescription) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `You are an expert HR assistant. Extract the following information from the job description provided in JSON format:
{
  "company": "Company Name",
  "role": "Job Title",
  "skills": ["Skill 1", "Skill 2"],
  "niceToHave": ["Nice skill 1", "Nice skill 2"],
  "seniority": "Entry level / Mid / Senior",
  "location": "Location info"
}
If any piece of information is missing, use null or an empty array.

Job Description:
${jobDescription}`;
    const response = yield ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });
    const content = response.text;
    if (!content)
        throw new Error("Failed to parse JD");
    return JSON.parse(content);
});
exports.parseJobDescription = parseJobDescription;
const generateResumeSuggestions = (jobDescription, role, company) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `You are an expert resume writer. Generate 3 to 5 tailored resume bullet points for a candidate applying to the "${role}" position at "${company}". 
Base your suggestions purely on the provided job description. Focus on impact, metrics, and exact skills mentioned. DO NOT output anything other than a JSON object containing a "suggestions" array of strings:
{
  "suggestions": ["point 1", "point 2"]
}

Job Description:
${jobDescription}`;
    const response = yield ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });
    const content = response.text;
    if (!content)
        throw new Error("Failed to generate suggestions");
    // ensure we return standard string arrays
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed))
        return parsed;
    if (parsed.suggestions && Array.isArray(parsed.suggestions))
        return parsed.suggestions;
    if (parsed.bulletPoints && Array.isArray(parsed.bulletPoints))
        return parsed.bulletPoints;
    return Object.values(parsed);
});
exports.generateResumeSuggestions = generateResumeSuggestions;
