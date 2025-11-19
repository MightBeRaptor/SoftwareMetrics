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

    // 🟩 IMPORTANT: streaming = false so response comes back as one JSON object
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-oss:20b",
        prompt,
        stream: false
      }),
    });

    const raw = await response.json();
    console.log("Ollama raw:", raw);

    // Ollama will return → { response: "text" }
    const aiText = raw.response || "";
    console.log("Ollama response text:", aiText);

    // ----- JSON EXTRACTION -----
    let parsed;
    try {
      // Remove code fences
      const clean = aiText.replace(/```json|```/g, "").trim();

      // Extract JSON object
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON detected in AI response.");

      const jsonStr = match[0];

      parsed = JSON.parse(jsonStr);

      if (!parsed.misuseCases)
        throw new Error("AI response missing misuseCases.");
    } catch (err) {
      console.error("JSON parse failed:", err);
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
      {
        output: {
          misuseCases: [
            {
              relatedUseCase: "N/A",
              threatType: "Error",
              cwe: "N/A",
              capec: "N/A",
              description: String(error),
              mitigations: [],
            },
          ],
        },
      },
      { status: 500 }
    );
  }
}