# AI Chat Application

A full-stack AI chat application built with Next.js 15, PostgreSQL, and Google Gemini. This project features persistent chat history, secure GitHub authentication, and real-time streaming AI responses.

## 🚀 Features

* **Real-time Streaming:** AI responses stream character-by-character for a responsive UX.
* **Persistent Storage:** All conversations and messages are stored in PostgreSQL via Supabase.
* **Authentication:** Secure login via GitHub OAuth (NextAuth.js).
* **Chat History:** Users can view and revisit previous conversation threads.
* **Responsive UI:** Clean, dark-mode interface built with Tailwind CSS.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React
* **Backend:** Next.js API Routes (Serverless)
* **Database:** PostgreSQL (hosted on Supabase), Prisma ORM
* **Authentication:** NextAuth.js (GitHub Provider)
* **AI Model:** Google Gemini 1.5 Flash (via Vercel AI SDK)

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

git clone https://github.com/rajtharani77/ai-chat-assignment.git
cd ai-chat
2. Install Dependencies

npm install

3. Environment Configuration
Create a .env file in the root directory. You will need credentials from Supabase, GitHub, and Google AI Studio.

Code snippet

# Database (Supabase)
# Use port 6543 (transaction pooler) or 5432 (session)
DATABASE_URL="postgresql://postgres.[USER]:[PASSWORD]@[aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1](https://aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1)"

# Authentication (GitHub OAuth)
# Generate these at GitHub Developer Settings > OAuth Apps
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_string"

# AI Provider (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"

4. Database Setup
Push the Prisma schema to your PostgreSQL database:

npx prisma generate
npx prisma db push

5. Run the Application
Start the development server:


npm run dev
Open http://localhost:3000 in your browser.

🏗️ Architecture Decisions
Database Schema
I designed a relational schema using Prisma with three main models:

User: Created via GitHub OAuth login.

Conversation: Linked to a User. Acts as a container for messages.

Message: Stores the actual content (role enum: 'user' or 'assistant') and timestamps.

Reasoning: This normalization allows efficient fetching of history lists without loading entire message bodies, while ensuring data privacy (users only access their own conversations).

AI Streaming
Instead of waiting for the full response, I utilized the Vercel AI SDK (streamText).

Reasoning: Large Language Models can be slow. Streaming provides immediate feedback to the user, significantly improving perceived performance compared to a standard request-response cycle.

Model Selection
I chose Gemini 1.5 Flash over the Pro variant.

Reasoning: The Pro model on the free tier has strict rate limits (Requests Per Minute) which causes frequent 429 errors during testing. The Flash model provides a balance of speed, intelligence, and generous rate limits suitable for a chat application.

⏱️ Time Taken
Approximately 12-14 hours. This includes initial setup, debugging Supabase connection issues (switching between transaction pooler ports), handling Google API quota limits, and deployment configuration.

📝 License
This project is for assignment submission purposes.