const { GoogleGenerativeAI } = require("@google/generative-ai");

const isGeminiEnabled = () => {
  return !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
};

// Initialize Gemini client if API key is provided
let genAI = null;
let model = null;
if (isGeminiEnabled()) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("🤖 Gemini AI SDK configured successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize Gemini AI client:", error.message);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY is not defined in environment variables. Falling back to mock AI data generation.");
}

// Helper to execute generateContent with an automatic fallback to gemini-pro if gemini-1.5-flash is not found/supported
const generateContentText = async (prompt) => {
  if (!model) throw new Error("Gemini model not initialized");
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    const errorMsg = error.message ? error.message.toLowerCase() : "";
    if ((errorMsg.includes("not found") || errorMsg.includes("not supported") || errorMsg.includes("404")) && genAI) {
      console.warn("⚠️ Primary model gemini-1.5-flash is not supported. Trying fallback gemini-pro model...");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await fallbackModel.generateContent(prompt);
        return result.response.text();
      } catch (fallbackError) {
        console.error("Gemini fallback model error:", fallbackError.message);
        throw fallbackError;
      }
    }
    throw error;
  }
};

const parseTranscriptContext = (transcript) => {
  if (!transcript || typeof transcript !== "string") {
    return { title: "Project Sync", desc: "status update checkpoints", creator: "Host" };
  }
  const titleMatch = transcript.match(/meeting about "([^"]+)"/);
  const descMatch = transcript.match(/description mentions: ([^.]+)\./);
  const creatorMatch = transcript.match(/^0\d:\d{2}\s+([\w\s]+):/m);
  
  return {
    title: titleMatch ? titleMatch[1] : "Project Sync",
    desc: descMatch ? descMatch[1] : "status update checkpoints",
    creator: creatorMatch ? creatorMatch[1].trim() : "Host"
  };
};

// ----------------------------------------------------
// 1. Generate Summary
// ----------------------------------------------------
const generateSummary = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Based on the following meeting transcript, generate a concise summary (around 3-4 sentences) outlining the main points discussed:\n\n${transcript}`;
      return await generateContentText(prompt);
    } catch (error) {
      console.error("Gemini summary error (falling back to mock):", error.message);
    }
  }

  // Fallback Summary Generator
  const ctx = parseTranscriptContext(transcript);
  return `The meeting focused on the goals and objectives of "${ctx.title}". The team reviewed key milestones and aligned on status checkpoints regarding ${ctx.desc}. Next steps were outlined and tasks were distributed among participants.`;
};

// ----------------------------------------------------
// 2. Generate Action Items
// ----------------------------------------------------
const generateActionItems = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Based on the following meeting transcript, extract a list of action items or tasks assigned to individuals. Return them as a clean array of strings, one task per line without numbers or prefixes:\n\n${transcript}`;
      const text = await generateContentText(prompt);
      return text
        .split("\n")
        .map(item => item.replace(/^[-*•\d.\s]+/, "").trim())
        .filter(item => item.length > 0);
    } catch (error) {
      console.error("Gemini action items error (falling back to mock):", error.message);
    }
  }

  // Fallback Action Items
  const ctx = parseTranscriptContext(transcript);
  return [
    `Follow up on action items discussed for ${ctx.title}`,
    "Coordinate timelines with other team members",
    "Prepare status updates prior to the next sync"
  ];
};

// ----------------------------------------------------
// 3. Generate Key Decisions
// ----------------------------------------------------
const generateKeyDecisions = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Based on the following meeting transcript, extract the key decisions made during the call. Return them as a list of strings, one decision per line:\n\n${transcript}`;
      const text = await generateContentText(prompt);
      return text
        .split("\n")
        .map(item => item.replace(/^[-*•\d.\s]+/, "").trim())
        .filter(item => item.length > 0);
    } catch (error) {
      console.error("Gemini key decisions error (falling back to mock):", error.message);
    }
  }

  // Fallback Decisions
  const ctx = parseTranscriptContext(transcript);
  return [
    `Approved the preliminary objectives of ${ctx.title}`,
    "Agreed on the task timeline and upcoming deliverables"
  ];
};

// ----------------------------------------------------
// 4. Generate Keywords
// ----------------------------------------------------
const generateKeywords = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Extract exactly 5 key technologies or topics discussed in this transcript as a comma-separated list of words (e.g. React, Node, WebRTC, etc.):\n\n${transcript}`;
      const text = await generateContentText(prompt);
      return text
        .split(",")
        .map(word => word.trim())
        .filter(word => word.length > 0);
    } catch (error) {
      console.error("Gemini keywords error (falling back to mock):", error.message);
    }
  }

  // Fallback Keywords
  const ctx = parseTranscriptContext(transcript);
  return [ctx.title, "Collaboration", "Strategy", "Task Alignment", "Milestones"];
};

// ----------------------------------------------------
// 5. Generate Sentiment Analysis
// ----------------------------------------------------
const generateSentiment = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Analyze the tone and sentiment of the following meeting transcript. Output exactly one word representing the primary sentiment: "Positive", "Negative", or "Neutral":\n\n${transcript}`;
      const text = await generateContentText(prompt);
      const cleaned = text.trim();
      if (["Positive", "Negative", "Neutral"].includes(cleaned)) {
        return cleaned;
      }
      return "Positive";
    } catch (error) {
      console.error("Gemini sentiment error (falling back to mock):", error.message);
    }
  }

  // Fallback Sentiment
  return "Positive";
};

// ----------------------------------------------------
// 6. Generate Calendar Tasks
// ----------------------------------------------------
const generateCalendarTasks = async (transcript) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `From the transcript, identify any follow-up events or reminders that have explicit dates or relative timings (like tomorrow, next week). Return them in a clean JSON list format: [{"title": "task description", "dueDate": "YYYY-MM-DD"}]:\n\n${transcript}`;
      const text = await generateContentText(prompt);
      // Try to parse JSON output
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]") + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(text.slice(jsonStart, jsonEnd));
      }
    } catch (error) {
      console.error("Gemini calendar task error (falling back to mock):", error.message);
    }
  }

  // Fallback Calendar Tasks
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [
    { title: "Review CORS and WebRTC dynamic patch on staging", dueDate: tomorrow }
  ];
};

// ----------------------------------------------------
// 7. AI Chat Assistant
// ----------------------------------------------------
const aiChat = async (meetingDetails, chatHistory, userMessage) => {
  if (isGeminiEnabled() && model) {
    try {
      const chatPrompt = `You are a helpful AI assistant for the meeting room web application.
Below are the details and transcript of the meeting we are discussing:
Title: ${meetingDetails.title}
Transcript: ${meetingDetails.transcript}

Below is the chat history:
${chatHistory.map(h => `${h.role === "user" ? "User" : "AI"}: ${h.text}`).join("\n")}

User Question: ${userMessage}
Answer the user's question accurately using only the meeting context. Keep your response helpful and concise.`;
      
      return await generateContentText(chatPrompt);
    } catch (error) {
      console.error("Gemini AI Chat error (falling back to mock):", error.message);
    }
  }

  // Fallback Chat Assistant Rules
  const lowerMsg = userMessage.toLowerCase();
  const title = meetingDetails?.title || "Global Workspace";
  const host = meetingDetails?.host || (meetingDetails?.createdBy?.name || "User");
  
  // Format summary text
  let summaryText = "";
  if (meetingDetails?.summary) {
    summaryText = Array.isArray(meetingDetails.summary) 
      ? meetingDetails.summary.join(" ") 
      : meetingDetails.summary;
  }

  // GREETINGS
  if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey") || lowerMsg.includes("sup")) {
    return `Hello! Main aapki meeting analyze karne ke liye ready hoon. Aaj hum "${title}" meeting ke context ke bare mein baat kar rahe hain. Main aapko is meeting ke key decisions, action items ya specific points discuss karne mein help kar sakta hoon.`;
  }

  // TASKS / ACTION ITEMS
  if (lowerMsg.includes("task") || lowerMsg.includes("action") || lowerMsg.includes("kaam") || lowerMsg.includes("todo") || lowerMsg.includes("assign")) {
    if (meetingDetails?.actionItems && meetingDetails.actionItems.length > 0) {
      return `Is meeting ke actions aur tasks list yeh hain:\n\n${meetingDetails.actionItems.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}`;
    }
    return `Is meeting mein koi specific action items ya tasks assign nahi kiye gaye hain.`;
  }

  // SUMMARY
  if (lowerMsg.includes("summary") || lowerMsg.includes("short") || lowerMsg.includes("brief") || lowerMsg.includes("kya hua") || lowerMsg.includes("what happened")) {
    if (summaryText) {
      return `Is meeting ka summary overview yeh hai:\n\n"${summaryText}"`;
    }
    return `Is meeting mein dynamic AI summary generate nahi hui hai. Par meeting ka topic "${title}" discuss kiya gaya था.`;
  }

  // DECISIONS
  if (lowerMsg.includes("decision") || lowerMsg.includes("faisla") || lowerMsg.includes("agree") || lowerMsg.includes("decide")) {
    if (meetingDetails?.keyDecisions && meetingDetails.keyDecisions.length > 0) {
      return `Meeting ke key decisions list yeh hain:\n\n${meetingDetails.keyDecisions.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}`;
    }
    return `Meeting mein koi specific formal decisions listed nahi hain, but team alignment complete ho chuki hai.`;
  }

  // DETAILS / ABOUT / INFO
  if (lowerMsg.includes("detail") || lowerMsg.includes("about") || lowerMsg.includes("info") || lowerMsg.includes("context") || lowerMsg.includes("batana") || lowerMsg.includes("batao")) {
    return `Is meeting ki specific details aur context details yeh hain:\n\n- **Title**: ${title}\n- **Host**: ${host}\n- **Summary**: ${summaryText || "Summary not processed yet."}\n- **Description**: ${meetingDetails?.description || "No description provided."}`;
  }

  // HOST / CREATOR
  if (lowerMsg.includes("host") || lowerMsg.includes("creator") || lowerMsg.includes("owner") || lowerMsg.includes("kisne start")) {
    return `Is meeting ko "${host}" ne host/create kiya tha.`;
  }

  // DIALOGUE MATCHING BY PEOPLE
  if (lowerMsg.includes("harsh") || lowerMsg.includes("sania") || lowerMsg.includes("laxmi") || lowerMsg.includes("amit")) {
    const person = lowerMsg.includes("harsh") ? "Harsh" : lowerMsg.includes("sania") ? "Sania" : lowerMsg.includes("laxmi") ? "Laxmi" : "Amit";
    let foundLines = [];
    if (meetingDetails?.transcript) {
      const transcriptStr = Array.isArray(meetingDetails.transcript) 
        ? meetingDetails.transcript.map(t => `${t.speaker}: ${t.text}`).join("\n")
        : meetingDetails.transcript;
      
      const lines = transcriptStr.split("\n");
      foundLines = lines.filter(line => line.toLowerCase().includes(person.toLowerCase()));
    }
    if (foundLines.length > 0) {
      return `Transcript ke according, ${person} ne ye baatein boli hain:\n\n${foundLines.map(l => `- ${l}`).join("\n")}`;
    }
    return `Transcript mein ${person} ke direct words available nahi hain.`;
  }

  // CORS SPECIFIC
  if (lowerMsg.includes("cors") || lowerMsg.includes("origin") || lowerMsg.includes("port")) {
    return `Harsh ne CORS allowed origin match rules update kiye hain. Regex allowed origins configurations lagaye gaye hain taaki standard aur dynamic local network connections properly link ho sakein.`;
  }

  // GENERAL FALLBACK
  if (summaryText) {
    return `Is meeting ke context ke according: "${summaryText.slice(0, 150)}..." Aap iske action items ya decisions ke baare mein specifically kuch aur janna chahte hain?`;
  }
  
  return `Main aapka query samajh gaya hoon: "${userMessage}". Aap is meeting ke summary details, action items, ya decisions ko check karne ke liye bol sakte hain.`;
};

// ----------------------------------------------------
// 8. Smart Semantic Search
// ----------------------------------------------------
const semanticSearchMatches = async (query, meetings) => {
  if (isGeminiEnabled() && model) {
    try {
      const meetingsData = meetings.map(m => ({ id: m._id || m.id, title: m.title, summary: m.summary, keywords: m.keywords }));
      const searchPrompt = `Given the search query: "${query}", filter the following meetings list and return a JSON list of the matching meeting IDs that are relevant to the query. Relevance can match summaries, keywords, or titles. Return ONLY the JSON list of matched IDs:
${JSON.stringify(meetingsData)}`;
      
      const text = await generateContentText(searchPrompt);
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]") + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(text.slice(jsonStart, jsonEnd));
      }
    } catch (error) {
      console.error("Gemini semantic search error (falling back to mock):", error.message);
    }
  }

  // Fallback simple search keyword matching
  const queryLower = query.toLowerCase();
  return meetings
    .filter(m => 
      m.title.toLowerCase().includes(queryLower) ||
      (m.summary && m.summary.toLowerCase().includes(queryLower)) ||
      (m.keywords && m.keywords.some(k => k.toLowerCase().includes(queryLower)))
    )
    .map(m => m._id || m.id);
};

// ----------------------------------------------------
// 9. AI Study Note Generator
// ----------------------------------------------------
const generateAINote = async (meeting) => {
  const context = meeting.transcript || meeting.summary || meeting.description || "No context available";
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Based on the following meeting details, write a professional, highly structured meeting study note. Format it with clean markdown headings (e.g. ## Overview, ## Critical Topics Discussed, ## Key Outcomes & Next Steps). Keep it detailed and helpful:\n\nTitle: ${meeting.title}\nContext: ${context}`;
      return await generateContentText(prompt);
    } catch (error) {
      console.error("Gemini AI Note generator error (falling back to mock):", error.message);
    }
  }
  
  // Fallback Note
  const mockSummary = meeting.summary || meeting.description || "Team aligned on discussion points and scheduled next milestones.";
  
  const title = meeting.title || "Project Sync";
  const desc = meeting.description || "";
  
  let criticalTopics = [
    `Discussion regarding key objectives of ${title}.`,
    `Review of ongoing developments and project progression.`,
    `Alignment on upcoming project timelines and deliverables.`
  ];
  
  if (desc) {
    const lines = desc.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 5);
    if (lines.length > 0) {
      criticalTopics = lines.map(line => `${line}.`);
    }
  }
  
  const creator = meeting.createdBy?.name || "Team Lead";
  
  return `## Overview
This note summarizes the discussion on "${title}".

## Critical Topics Discussed
${criticalTopics.map(topic => `- ${topic}`).join("\n")}

## Key Outcomes & Next Steps
- Summary Context: ${mockSummary}
- ${creator} to consolidate feedback and coordinate implementation schedule.
- Team members to update status logs prior to next sync.`;
};

// 10. AI Analytics Insights Generator
const generateAnalyticsInsights = async (stats, sentiments, keywords) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Based on the following team meeting analytics statistics, write a professional, detailed, bulleted summary of AI productivity recommendations and team insights. Format it with clean markdown headings (e.g. ## Focus Areas, ## Productivity Metrics, ## Next Action Recommendations). Keep it realistic and concise:\n\nStatistics:\n- Total Meetings: ${stats.totalMeetings}\n- Avg Participants: ${stats.avgParticipants}\n- Total Action Items: ${stats.totalActions}\n- Sentiments: Positive (${sentiments.positive}), Neutral (${sentiments.neutral}), Critical (${sentiments.negative})\n- Discussed Keywords: ${keywords.map(k => k.text).join(", ")}`;
      return await generateContentText(prompt);
    } catch (error) {
      console.error("Gemini AI Analytics Insights error (falling back to mock):", error.message);
    }
  }
  
  // Fallback Insights
  return `## Focus Areas
- **Signaling connection optimization**: Team is actively focusing on local network host bindings.
- **Cross-browser checks**: Mitigating CORS blockers is prioritized.

## Productivity Metrics
- Good team engagement with an average of ${stats.avgParticipants || 3} participants per call.
- Total of ${stats.totalActions || 2} action items assigned across sessions.

## Next Action Recommendations
- Harsh to finalize prod domain CORS configuration protocols.
- Ensure all team tasks are scheduled in the unified calendar dashboard.`;
};

// 11. AI Workspace Biography Generator
const generateAIBio = async (name, role, department) => {
  if (isGeminiEnabled() && model) {
    try {
      const prompt = `Write a catchy, professional 2-sentence workspace bio tagline for an employee named "${name}" who works as a "${role}" in the "${department}" department. Make it motivating and inspiring. Do not use markdown quotes:`;
      return await generateContentText(prompt);
    } catch (error) {
      console.error("Gemini AI Bio generator error (falling back to mock):", error.message);
    }
  }
  
  // Fallback bio tagline
  return `${name} is a dedicated ${role} in the ${department} division, actively facilitating real-time signaling architectures and cross-functional collaborations.`;
};

module.exports = {
  generateSummary,
  generateActionItems,
  generateKeyDecisions,
  generateKeywords,
  generateSentiment,
  generateCalendarTasks,
  aiChat,
  semanticSearchMatches,
  generateAINote,
  generateAnalyticsInsights,
  generateAIBio,
};
