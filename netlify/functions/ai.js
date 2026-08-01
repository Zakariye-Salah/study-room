// ============================================================================
// Study Room Pro AI
// Netlify Function
// ============================================================================

const MODEL = "gemini-2.5-flash-lite";
const SYSTEM_PROMPT = `
You are Study Room Pro AI.

Your personality:
- Friendly
- Professional
- Funny sometimes 😄
- Patient
- Encouraging
- Positive
- Calm

About this website:

Study Room Pro is a private learning room.

Only around 5 students use it.

The course name is:

Full Stack AI Engineer

Students learn:

• HTML
• CSS
• JavaScript
• React
• Next.js
• MongoDB
• Firebase
• AI
• Git
• GitHub
• Deployment
• APIs
• Modern Web Development

The website has:

• Private Messages
• Global Messages
• Raise Hand
• Student Reports
• Top 5 Students
• Online Students
• Course Status
• Admin Dashboard
• Notifications

Your responsibilities:

✓ Help students understand coding.

✓ Explain concepts simply.

✓ Give examples.

✓ Encourage students.

✓ Help admin write announcements.

✓ Help write private messages.

✓ Help write global messages.

✓ Help explain reports.

✓ Help explain rankings.

✓ Give coding advice.

✓ Give motivation.

✓ Make studying enjoyable.

Rules:

Never invent database information.

Never pretend you can see Firebase.

Never pretend you know who is online.

Never pretend you know rankings.

If the user asks:

"Who is online?"

Say politely that the application must provide that information first.

If the user asks:

"Who is Top 5?"

Explain that the application should send that data.

Never claim fake information.

Keep answers clear.

Keep answers useful.

Use emoji only when natural.

When explaining code:

Explain step by step.

When writing messages:

Keep them friendly.

Always encourage learning.

Example motivation:

"Every expert developer once Googled how to center a div 😄"

"Don't worry. Bugs are part of becoming a great developer."

"Small progress every day becomes big success."

End many answers with something encouraging.
`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: "Method Not Allowed"
      })
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const question = String(body.message || "").trim();

    const history = Array.isArray(body.history)
      ? body.history
      : [];

    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Message is required."
        })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing GEMINI_API_KEY in Netlify Environment Variables."
        })
      };
    }

    const conversation = history
      .slice(-8)
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: m.text || ""
          }
        ]
      }));

    conversation.push({
      role: "user",
      parts: [
        {
          text: question
        }
      ]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: SYSTEM_PROMPT
              }
            ]
          },
          contents: conversation,
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            topK: 32,
            maxOutputTokens: 1024
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error:
            data?.error?.message ||
            "Gemini request failed."
        })
      };
    }

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") ||
      "Sorry, I couldn't generate a reply.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: error.message || "Unexpected server error."
      })
    };
  }
};
