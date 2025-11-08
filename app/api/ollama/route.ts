import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const diagramData = await req.json();
    console.log("Received diagram JSON:", diagramData);

    const prompt = `
You are a software security analyst AI.
Analyze the following UML Use Case diagram JSON and identify potential misuse cases.
For each misuse case, provide:
- relatedUseCase: The legitimate use case it affects
- threatType: The type of threat (e.g., STRIDE)
- cwe: Relevant CWE
- capec: Relevant CAPEC
- description: Short description of the misuse case
- mitigations: Array of mitigation strategies

Use OWASP, STRIDE, CAPEC, and CWE references.
Return ONLY valid JSON in the following structure:

{
  "misuseCases": [
    {
      "relatedUseCase": "string",
      "threatType": "string",
      "cwe": "string",
      "capec": "string",
      "description": "string",
      "mitigations": ["string"]
    }
  ]
}

Here is the diagram JSON:
${JSON.stringify(diagramData)}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss:20b",
        prompt,
      }),
    });

    const text = await response.text();
    console.log("Ollama raw response:", text);

    // Attempt to extract JSON from AI response
    let parsed;
    try {
      // Remove code fences and trim whitespace
      const cleanText = text.replace(/```json|```/g, "").trim();

      // Extract first {...} JSON object, ignoring anything after
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON object found in AI response");

      let jsonStr = match[0];

      // Remove any trailing characters after last closing brace
      const lastBrace = jsonStr.lastIndexOf("}");
      if (lastBrace !== -1) jsonStr = jsonStr.slice(0, lastBrace + 1);

      parsed = JSON.parse(jsonStr);

      if (!parsed.misuseCases) throw new Error("Missing 'misuseCases' in AI response");
    } catch (parseErr) {
      console.error("Failed to parse Ollama JSON:", parseErr);
      parsed = {
        misuseCases: [
          {
            relatedUseCase: "N/A",
            threatType: "Error",
            cwe: "N/A",
            capec: "N/A",
            description: "Invalid or missing AI response",
            mitigations: [],
          },
        ],
      };
    }

    return NextResponse.json({ output: parsed });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { output: {
        misuseCases: [
          {
            relatedUseCase: "N/A",
            threatType: "Error",
            cwe: "N/A",
            capec: "N/A",
            description: error || "Failed to connect to Ollama",
            mitigations: [],
          },
        ],
      } },
      { status: 500 }
    );
  }
}
