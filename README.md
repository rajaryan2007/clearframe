# <img src="public/logo.svg" width="32" height="32" valign="middle" /> ClearFrame

> **AI-Powered Information Clarity.** Transform the way you process, analyze, and understand text with precision.

ClearFrame is a modern, intelligent data processing platform designed to extract deep insights from text and images. Whether it's detecting emotional undertones, identifying hidden biases, or generating objective rewrites, ClearFrame provides the tools you need to see through the noise.

---

## ✨ Key Features

### <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Intelligent Text Analysis
Leverage state-of-the-art LLMs (Groq/Gemini) to perform multi-dimensional analysis:
- **Emotion Detection**: Identify the underlying sentiment and emotional triggers.
- **Bias Analysis**: Detect political, social, or cognitive biases in any text.
- **Manipulation Scoring**: Get a quantitative score on how manipulative a piece of content is.

### <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg> Browser Extension
Analyze web content on the fly. Select any text on a webpage and get instant insights without leaving your tab. Synchronizes perfectly with your web dashboard.

### <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Smart Rewrites
Automatically generate neutral, fact-based rewrites of biased or emotionally charged text. Perfect for researchers, journalists, and critical thinkers.

### <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2z"></path><circle cx="8" cy="9" r="2"></circle><path d="m21 15-5-5L5 21"></path></svg> OCR Extraction
Powered by Tesseract.js, ClearFrame can extract text from images and documents, bringing intelligent analysis to non-selectable content.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15+](https://nextjs.org), [Tailwind CSS 4](https://tailwindcss.com), [Radix UI](https://www.radix-ui.com)
- **Backend**: [Inngest](https://www.inngest.com) (Serverless Workflows), [MongoDB](https://www.mongodb.com) (Mongoose)
- **AI/ML**: [Groq SDK](https://groq.com), [Google Gemini](https://ai.google.dev)
- **Authentication**: [Clerk](https://clerk.com)
- **Utilities**: [Tesseract.js](https://tesseract.projectnaptha.com), [Lucide React](https://lucide.dev)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (Atlas or local)
- Clerk account for authentication
- Groq or Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajaryan2007/clearframe.git
   cd clearframe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   INNGEST_EVENT_KEY=your_inngest_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Start Inngest Dev Server**
   ```bash
   npm run inngest
   ```

---

## 🔌 Browser Extension

The ClearFrame extension allows you to analyze text directly from any website.

### How to Install

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the `extension` folder from this project directory.
5. Pin ClearFrame to your toolbar for easy access!

---

## 📄 License

This project is private and for demonstration purposes. Contact the owner for usage rights.

---

<p align="center">
  Built with precision by <a href="https://github.com/rajaryan2007">rajaryan2007</a>
</p>
