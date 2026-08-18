import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const event = await req.json();

  // Basic validation
  if (!event.event_type || !event.domain) {
    return NextResponse.json(
      { error: "Invalid event structure" },
      { status: 400 }
    );
  }

  // Ensure Azure config exists
  if (
    !process.env.AZURE_OPENAI_ENDPOINT ||
    !process.env.AZURE_OPENAI_DEPLOYMENT ||
    !process.env.AZURE_OPENAI_KEY
  ) {
    return NextResponse.json(
      { error: "Missing Azure OpenAI configuration" },
      { status: 500 }
    );
  }

  // FARGUS system instructions
  const systemInstructions = `
    I am FARGUS, a domain watchdog.
    I only analyze domain events and return structured JSON.
    I do not chat or generate creative content.
    Respond ONLY with content such as:
    risk_level, reason, recommended_action, category, confidence.
  `;

  // Azure OpenAI call
  const response = await fetch(
    `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=2024-02-01`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.AZURE_OPENAI_KEY,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstructions },
          { role: "user", content: JSON.stringify(event) }
        ],
        temperature: 0.0
      })
    }
  );

  const data = await response.json();

  // Extract JSON safely
  let result;
  try {
    result = JSON.parse(data.choices[0].message.content);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Model returned invalid JSON",
        raw: data.choices?.[0]?.message?.content
      },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}
