# LinkFolio

This is a [Next.js](https://nextjs.org) project designed to help users generate a personalized portfolio website from their resume and a custom prompt. It leverages the Gemini API for content generation.

## Features

- **Resume Upload**: Upload your resume (PDF) to extract content.
- **AI-Powered Site Generation**: Generate a complete, visually engaging, recruiter-optimized portfolio website using the Gemini API based on your resume content and a custom prompt.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
- [npm](https://www.npmjs.com/get-npm) (Node Package Manager, usually comes with Node.js)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/apoorvgupt479/LinkFolio.git
    cd LinkFolio
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Environment Variables

This project requires a Gemini API key to function correctly.

1.  **Create a `.env.local` file** in the root of your project directory.

2.  **Add your Gemini API key** to this file:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Gemini API key. You can obtain one from the [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running the Application

To run the application, you first need to build it and then start the server.

1.  **Build the project:**

    ```bash
    npm run build
    ```

2.  **Start the application:**

    ```bash
    npm run start
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `src/app/api/generate-site/route.ts`: Handles the AI-powered site generation using the Gemini API.
-   `src/app/api/archive/upload-resume-route.ts`: Processes resume file uploads (PDF) and extracts text content.
-   `src/app/page.tsx`: The main application page.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
