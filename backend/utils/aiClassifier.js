const { GoogleGenerativeAI } = require("@google/generative-ai");

const ALLOWED_DEPARTMENTS = [
  "Electricity",
  "Water",
  "Sanitation",
  "Roads",
  "Public Safety",
  "Animal Control",
  "Noise & Public Disturbance",
  "Drainage & Sewage",
  "General",
];

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const normalizeDepartment = (value = "") => {
  const cleaned = String(value).trim().replace(/^["']|["']$/g, "");
  return ALLOWED_DEPARTMENTS.includes(cleaned) ? cleaned : "General";
};

const classifyDepartmentAI = async (text = "") => {
  try {
    if (!genAI) {
      return "General";
    }

    console.log("AI input:", text);

    const prompt = `You are an intelligent civic complaint classifier.

Classify the complaint into ONE department from:
Electricity, Water, Sanitation, Roads, Public Safety, Animal Control, Noise & Public Disturbance, Drainage & Sewage, General.

Examples:
- Street dog issue → Animal Control
- Theft → Public Safety
- Loud music → Noise & Public Disturbance
- Water leakage → Water

Return ONLY the department name. No explanation.

Complaint:
${text}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawOutput = response.text().trim();

    const department = normalizeDepartment(rawOutput);
    console.log("AI output:", rawOutput);
    console.log("AI normalized department:", department);

    return department;
  } catch (error) {
    console.error("AI classification failed:", error?.message || error);
    return "General";
  }
};

module.exports = {
  classifyDepartmentAI,
  ALLOWED_DEPARTMENTS,
};
