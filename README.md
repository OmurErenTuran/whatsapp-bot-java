# WhatsApp Chat Bot

A WhatsApp chatbot developed with Node.js using the WhatsApp Business API.

## Features

* Receives WhatsApp messages.
* Sends automated replies.
* Stores conversation history in a JSON file.
* Easy to customize and extend.

## Technologies

* Node.js
* WhatsApp Business API (Meta)
* JavaScript
* Git & GitHub

## Project Structure

* `index.js` — Main chatbot logic.
* `memory.json` — Stores conversation memory.
* `package.json` — Project dependencies.

## Future Improvements

* Spanish vocabulary quiz.
* AI-powered responses.
* Database integration.

## API Keys Required

To run this application, you need your own API keys.

### 1. Gemini API

* Create a Gemini API key from Google AI Studio.
* Add it to your `.env` file as:

```env
GEMINI_API_KEY=your_gemini_api_key
```

### 2. Tavily API

* Create a Tavily API key from the Tavily dashboard.
* Add it to your `.env` file as:

```env
TAVILY_API_KEY=your_tavily_api_key
```

## Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
```


> **Important:** Never commit your API keys to GitHub. The `.env` file is ignored by `.gitignore`.
