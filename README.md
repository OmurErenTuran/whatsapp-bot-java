# WhatsApp AI Chat Bot

An AI-powered WhatsApp chatbot built with **Node.js**, **Gemini API**, and **Tavily Search API**. The bot can answer questions using Gemini and retrieve up-to-date information from Tavily Search.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![WhatsApp API](https://img.shields.io/badge/WhatsApp-Business_API-25D366)
![Gemini](https://img.shields.io/badge/Gemini-AI-blue)
![Tavily](https://img.shields.io/badge/Tavily-Search-orange)
## Installation

1. Clone the repository.

```bash
git clone https://github.com/OmurErenTuran/whatsapp-bot-java.git
cd whatsapp-bot-java
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file using `.env.example`.

4. Add your own API keys.

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```

5. Start the bot.

```bash
node index.js
```
## Required API Keys

This project requires two API keys before it can run:

| API            | Purpose                                      |
| -------------- | -------------------------------------------- |
| **Gemini API** | AI responses for WhatsApp conversations.     |
| **Tavily API** | Real-time web search for up-to-date answers. |

Create your own API keys and place them in the `.env` file. The example variables are provided in `.env.example`.

> **Important:** Never upload your `.env` file or API keys to GitHub.
