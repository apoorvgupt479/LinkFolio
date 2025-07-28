"use client"; // This is needed for client-side interactivity

import Image from "next/image";
import { useState, FormEvent } from "react";

export default function Home() {
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileData(null);
    setError(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkedinUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await response.json();
      setProfileData(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          LinkedIn Profile to Portfolio
        </h1>
        <p className="text-lg text-center sm:text-left">
          Enter a public LinkedIn profile URL to generate a personalized portfolio.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="e.g., https://www.linkedin.com/in/johndoe"
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Portfolio"}
          </button>
        </form>

        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md w-full text-center">
            Error: {error}
          </div>
        )}

        {profileData && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Generated Portfolio</h2>
            <div className="space-y-2">
              {profileData.name && <p><strong>Name:</strong> {profileData.name}</p>}
              {profileData.headline && <p><strong>Headline:</strong> {profileData.headline}</p>}
              {profileData.location && <p><strong>Location:</strong> {profileData.location}</p>}
              {/* Add more fields as you expand the scraping logic */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                (This is a basic representation. Expand scraping logic in `src/app/api/scrape/route.ts` for more details.)
              </p>
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* Original footer content can remain or be simplified */}
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
