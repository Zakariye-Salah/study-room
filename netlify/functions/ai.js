// ============================================================================
// Study Room Pro AI
// Netlify Serverless Function
// Optimized Version 2
// Part 1A
// ============================================================================

// -----------------------------------------------------------------------------
// Gemini Model
// -----------------------------------------------------------------------------

// If your account supports Gemini 2.5 Flash Lite you can change it later.
// Since you confirmed Gemini 2.0 Flash currently works,
// we'll keep that model.

const MODEL = "gemini-2.0-flash";

// -----------------------------------------------------------------------------
// AI Identity
// -----------------------------------------------------------------------------

const SYSTEM_PROMPT = `
You are Study Room Pro AI.

You are the official AI assistant for Study Room Pro.

Your job is to help students learn programming,
understand the website,
and stay motivated.

-----------------------------------
ABOUT THE COURSE
-----------------------------------

Course Name:

Full Stack AI Engineer

Platform:

Dugsiiye.com

Students learn:

• HTML
• CSS
• JavaScript
• TypeScript
• React
• Next.js
• Node.js
• Express.js
• MongoDB
• Firebase
• REST APIs
• Git
• GitHub
• AI
• Deployment
• Modern Web Development

-----------------------------------
ABOUT THE WEBSITE
-----------------------------------

Study Room Pro is a private classroom website.

Only a small study group uses it.

The website contains features such as:

• Private Messages
• Global Messages
• Raise Hand
• Course Status
• Student Reports
• Top 5 Students
• Online Students
• Notifications
• Admin Dashboard

-----------------------------------
YOUR RESPONSIBILITIES
-----------------------------------

You should:

✓ Explain programming concepts.

✓ Explain code step by step.

✓ Help debug errors.

✓ Help students understand lessons.

✓ Give project ideas.

✓ Explain JavaScript.

✓ Explain React.

✓ Explain Next.js.

✓ Explain Firebase.

✓ Explain MongoDB.

✓ Explain AI concepts.

✓ Help write announcements.

✓ Help write messages.

✓ Help students prepare for interviews.

✓ Motivate students.

-----------------------------------
VERY IMPORTANT
-----------------------------------

Never invent website data.

Never pretend you can read Firebase.

Never pretend you know:

• Online students

• Rankings

• Reports

• Messages

• Course status

Unless the application sends that information.

Instead politely explain that the application must provide those values first.

-----------------------------------
YOUR STYLE
-----------------------------------

Be friendly.

Be professional.

Be positive.

Be patient.

Be encouraging.

Be concise.

Avoid very long answers unless requested.

Explain difficult topics using simple English.

Use emojis naturally.

Sometimes be funny.

Examples:

"Every senior developer once searched how to center a div 😄"

"Bugs are teachers wearing ugly clothes."

"Today's error becomes tomorrow's experience."

Encourage students often.

End many replies with something motivational.
`;

// -----------------------------------------------------------------------------
// Common Headers
// -----------------------------------------------------------------------------

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
// -----------------------------------------------------------------------------
// Main Netlify Function
// -----------------------------------------------------------------------------

exports.handler = async (event) => {

  // Handle browser preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        success: false,
        error: "Only POST requests are allowed."
      })
    };
  }

  try {

    const body = JSON.parse(event.body || "{}");

    const question = String(body.message || "").trim();

    const history = Array.isArray(body.history)
      ? body.history
      : [];

      const context = body.context || {};

    if (!question) {
      return {
        statusCode: 400,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          success: false,
          error: "Please enter a question."
        })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          success: false,
          error: "Gemini API Key is missing from Netlify Environment Variables."
        })
      };
    }

    const contextPrompt = `

Current Study Room Information:

Student Name: ${context.studentName || "Unknown"}

Seat: ${context.seatCode || "Unknown"}

Course: ${context.courseName || "Full Stack AI Engineer"}

Joined Room: ${context.inCourse ? "Yes" : "No"}

Hand Raised: ${context.handRaised ? "Yes" : "No"}

Online: ${context.online ? "Yes" : "No"}

Use this information only if it helps answer the student's question.
Never invent missing information.

`;

    // -------------------------------------------------------------------------
    // Keep only the last few messages to reduce token usage
    // -------------------------------------------------------------------------

    const conversation = history
      .slice(-6)
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: String(msg.text || "")
          }
        ]
      }));

      conversation.push({

        role: "user",
    
        parts: [
    
            {
    
                text: contextPrompt + "\n\nStudent Question:\n" + question
    
            }
    
        ]
    
    });




    // -------------------------------------------------------------------------
    // Build Gemini Request
    // -------------------------------------------------------------------------

    const requestBody = {

      system_instruction: {
        parts: [
          {
            text: SYSTEM_PROMPT
          }
        ]
      },

      contents: conversation,

      generationConfig: {

        temperature: 0.7,

        topP: 0.9,

        topK: 40,

        maxOutputTokens: 700

      }

    };    // -------------------------------------------------------------------------
    // Send Request to Gemini
    // -------------------------------------------------------------------------

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json().catch(() => ({}));

    // -------------------------------------------------------------------------
    // Handle Common Errors
    // -------------------------------------------------------------------------

    if (!response.ok) {

      let message = "Gemini request failed.";

      if (response.status === 429) {

        message =
          "AI is temporarily busy or your free quota has been reached. Please wait a little and try again.";

      } else if (response.status === 401) {

        message =
          "Invalid Gemini API Key.";

      } else if (response.status === 403) {

        message =
          "This API key does not have permission to use Gemini.";

      } else if (response.status === 404) {

        message =
          "The selected Gemini model is unavailable.";

      } else if (data?.error?.message) {

        message = data.error.message;

      }

      return {
        statusCode: response.status,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          success: false,
          error: message
        })
      };

    }

    // -------------------------------------------------------------------------
    // Read AI Reply
    // -------------------------------------------------------------------------

    const parts =
      data?.candidates?.[0]?.content?.parts || [];

    const reply = parts
      .map(part => part.text || "")
      .join("")
      .trim();

          // -------------------------------------------------------------------------
    // Final Reply
    // -------------------------------------------------------------------------

    const finalReply =
    reply ||
    "Sorry 😅 I couldn't generate a useful answer. Please try asking your question differently.";

  return {
    statusCode: 200,
    headers: JSON_HEADERS,
    body: JSON.stringify({
      success: true,
      reply: finalReply
    })
  };

} catch (error) {

  console.error("Study Room Pro AI Error:", error);

  let message = "Unexpected server error.";

  if (error.name === "AbortError") {
    message = "The AI request timed out. Please try again.";
  } else if (error.message) {
    message = error.message;
  }

  return {
    statusCode: 500,
    headers: JSON_HEADERS,
    body: JSON.stringify({
      success: false,
      error: message
    })
  };
}

};
