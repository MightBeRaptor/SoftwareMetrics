export async function sendDiagramToOllama(diagramJson: any) {
  try {
    const res = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diagramJson),
    });

    if (!res.ok) {
      console.error("Ollama API error:", res.status, await res.text());
      throw new Error(`Ollama API returned status ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.output) {
      throw new Error("Missing 'output' field in backend response");
    }

    // Validate structure
    if (!data.output.misuseCases || !Array.isArray(data.output.misuseCases)) {
      console.warn("AI response missing misuseCases, returning fallback");
      return {
        misuseCases: [
          {
            relatedUseCase: "N/A",
            threatType: "Invalid Response",
            cwe: "N/A",
            capec: "N/A",
            description: "AI returned data without a misuseCases array",
            mitigations: [],
          },
        ],
      };
    }

    return data.output;

  } catch (err: any) {
    console.error("Error sending diagram to Ollama:", err);

    return {
      misuseCases: [
        {
          relatedUseCase: "N/A",
          threatType: "Error",
          cwe: "N/A",
          capec: "N/A",
          description: err?.message || "Unknown error",
          mitigations: [],
        },
      ],
    };
  }
}
