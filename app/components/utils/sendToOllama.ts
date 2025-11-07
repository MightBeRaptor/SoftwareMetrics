export async function sendDiagramToOllama(diagramJSON: any) {
  try {
    const securityContext = `
        You are a software security analyst AI. 
        You are provided with a UML Use Case diagram in JSON format.

        Analyze the diagram to identify *potential misuse cases* — scenarios 
        where an attacker could abuse or subvert legitimate use cases.

        For each misuse case, output:
        - The related normal use case(s)
        - The type of threat (based on STRIDE)
        - Relevant CWE or CAPEC references
        - A short description of the misuse
        - Recommended mitigations (based on OWASP guidelines)

        Base your reasoning on established frameworks:
        - STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
        - OWASP Top 10 2023 categories
        - CAPEC (Common Attack Pattern Enumeration)
        - CWE (Common Weakness Enumeration)
        `;

    const prompt = `
        ${securityContext}

        Here is the UML Use Case Diagram in JSON format:
        ${JSON.stringify(diagramJSON, null, 2)}

        Output your analysis in JSON like this:
        {
        "misuseCases": [
            {
            "relatedUseCase": "Login",
            "threatType": "Spoofing",
            "cwe": "CWE-287: Improper Authentication",
            "capec": "CAPEC-115: Authentication Bypass",
            "description": "An attacker might impersonate a legitimate user via weak authentication.",
            "mitigations": [
                "Implement MFA",
                "Enforce secure password policies",
                "Use secure session management"
                ]
            }
        ]
        }
        `;

    const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        model: 'gpt-oss:20b',
        prompt,
        stream: false,
    }),
  });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Ollama's non-streaming response will be in data.response
    return data.response;
  } catch (err) {
    console.error('Error sending diagram to Ollama:', err);
    return null;
  }
}