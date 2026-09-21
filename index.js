const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const { pino } = require("pino");
const fs = require("fs");

// Your Gemini API key, loaded from an environment variable (never hardcode it here)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY environment variable. See README for setup.");
  process.exit(1);
}

const GEMINI_MODEL = "gemini-3.6-flash"; // free-tier model
const HISTORY_FILE = "memory.json";
const MAX_HISTORY_MESSAGES = 40; // ~20 back-and-forth exchanges

// Loads saved conversation history from disk, or starts fresh if none exists
function loadHistory() {
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

// Saves conversation history to disk
function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Sends the full conversation history to Gemini and returns its text reply
async function askGemini(history) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: history,
      tools: [{ google_search: {} }], // lets Gemini search the web when it needs to
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API error:", response.status, errText);
    return "Sorry, I hit an error talking to the AI just now.";
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || "(no text reply)";
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info");

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\nScan this QR code with WhatsApp (Linked Devices):\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log("Connection closed.", shouldReconnect ? "Reconnecting..." : "Logged out, delete auth_info to re-link.");
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    // Your own WhatsApp ID — used to detect messages in your "Message Yourself" chat
    const myJid = "266734799974573@lid";

    for (const msg of messages) {
      if (!msg.message) continue;

      const from = msg.key.remoteJid;
      const isSelfChat = from === myJid && msg.key.fromMe;

      // Only respond to messages YOU send to yourself (Message Yourself chat).
      // Ignore everything else — other contacts, groups, etc.
      if (!isSelfChat) continue;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        null;

      if (!text) {
        console.log("(Skipping non-text message)");
        continue;
      }

      console.log(`📩 (you): ${text}`);

      try {
        // Load past conversation, add the new message
        const history = loadHistory();
        history.push({ role: "user", parts: [{ text }] });

        // Keep only the most recent messages so the request doesn't grow forever
        const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

        const reply = await askGemini(trimmedHistory);

        // Save the bot's reply into history too, so it remembers what it said
        trimmedHistory.push({ role: "model", parts: [{ text: reply }] });
        saveHistory(trimmedHistory);

        await sock.sendMessage(from, { text: reply });
        console.log(`🤖 Replied: ${reply}`);
      } catch (err) {
        console.error("Error handling message:", err);
      }
    }
  });
}

startBot();