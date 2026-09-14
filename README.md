# FridgeChef 🍳

FridgeChef is a modern, AI-powered recipe generator that helps you create delicious meals using the ingredients you already have in your kitchen. It uniquely considers your current mood, the weather, and special occasions to suggest the perfect dish for any moment.

## ✨ Features

- **AI-Powered Recipe Generation:** Instantly creates recipes tailored to your available ingredients.
- **Kitchen Vibe™ Personalization:** Adjusts suggestions based on your mood (Happy, Tired, etc.), weather (Sunny, Rainy, etc.), and even local festivals.
- **Multilingual Experience:** Full support for English, Español, Français, हिन्दी, ગુજરાતી, தமிழ், ଓଡ଼ିଆ, ਪੰਜਾਬੀ, and اردو.
- **Health Insights:** Automated nutritional summaries for every generated recipe.
- **Favorites:** Save and manage your favorite culinary discoveries.
- **Modern UI/UX:** A clean, responsive interface with smooth animations and professional styling.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine:** [Firebase Genkit](https://firebase.google.com/docs/genkit) with Gemini 2.0
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Cloud/Firebase project with the Gemini API enabled.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd fridge-chef
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

## 📱 Project Structure

- `src/ai`: Genkit flows and AI prompt definitions.
- `src/app`: Next.js pages and Server Actions.
- `src/components`: Reusable UI components and the main client dashboard.
- `src/hooks`: Custom React hooks for UI state and responsiveness.

## 📄 License

This project is open-source and available under the MIT License.
