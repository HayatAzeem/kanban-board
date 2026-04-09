import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseJobDescription = async (jobDescription: string) => {
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

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Failed to parse JD");
  return JSON.parse(content);
};

export const generateResumeSuggestions = async (jobDescription: string, role: string, company: string) => {
  const prompt = `You are an expert resume writer. Generate 3 to 5 tailored resume bullet points for a candidate applying to the "${role}" position at "${company}". 
Base your suggestions purely on the provided job description. Focus on impact, metrics, and exact skills mentioned. DO NOT output anything other than a JSON object containing a "suggestions" array of strings:
{
  "suggestions": ["point 1", "point 2"]
}

Job Description:
${jobDescription}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Failed to generate suggestions");

  // ensure we return standard string arrays
  const parsed = JSON.parse(content);
  // Depending on how GPT formats the JSON object containing an array, we handle it:
  if (Array.isArray(parsed)) return parsed;
  if (parsed.suggestions && Array.isArray(parsed.suggestions)) return parsed.suggestions;
  if (parsed.bulletPoints && Array.isArray(parsed.bulletPoints)) return parsed.bulletPoints;
  
  return Object.values(parsed);
};
