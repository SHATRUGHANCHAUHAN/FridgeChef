# FridgeChef 🍳

FridgeChef is a modern, AI-powered recipe generator that helps you create delicious meals using the ingredients you already have in your kitchen. It considers your current mood, the weather, and meal timing to suggest the perfect dish for any moment.

## ✨ Features

- **AI-Powered Recipe Generation:** Instantly creates recipes tailored to your available ingredients using Google's Gemini models via Firebase Genkit.
- **Kitchen Vibe™ Personalization:** Adjusts suggestions based on your mood (Happy, Tired, Energetic, Calm), weather (Sunny, Rainy, Cold, Hot), and specific meal times.
- **Meal Timing:** Specialized suggestions for Breakfast, Lunch, or Dinner.
- **Multilingual Experience:** Full support for English, Español, Français, हिन्दी, ગુજરાતી, தமிழ், ଓଡ଼ିଆ, ਪੰਜਾਬੀ, and اردو.
- **Health Insights:** Automated nutritional summaries for every generated recipe with safety-fallback mechanisms.
- **Favorites:** Save and manage your favorite culinary discoveries locally.
- **Modern UI/UX:** A clean, responsive interface built with Shadcn UI, Tailwind CSS, and Framer Motion, optimized for readability.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Gemini 2.0 Flash
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google AI (Gemini) API Key.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SHATRUGHANCHAUHAN/FridgeChef.git
   cd FridgeChef
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## 📄 License

This project is open-source and available under the MIT License.
