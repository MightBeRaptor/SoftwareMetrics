export async function sendDiagramToOllama(diagramJson: any) {
  try {
    const res = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diagramJson),
    });

    const data = await res.json();
    return data.output;
  } catch (err) {
    console.error("Error sending diagram to Ollama:", err);
    return {
      misuseCases: [
        {
          relatedUseCase: "N/A",
          threatType: "Error",
          cwe: "N/A",
          capec: "N/A",
          description: "Failed to connect to Ollama",
          mitigations: [],
        },
      ],
    };
  }
}
