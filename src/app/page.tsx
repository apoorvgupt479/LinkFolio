"use client"; // This is needed for client-side interactivity

import Image from "next/image";
import { useState, FormEvent, ChangeEvent } from "react";

export default function Home() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [stylePrompt, setStylePrompt] = useState<string>("");
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useQualityModel, setUseQualityModel] = useState<boolean>(false); // true for 2.5 (quality), false for 2.0 (speed)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedHtml(null);
    setError(null);

    if (!resumeFile) {
      setError("Please upload a resume file.");
      setLoading(false);
      return;
    }

    try {
      // Read the file as an ArrayBuffer
      const arrayBuffer = await resumeFile.arrayBuffer();
      const base64Resume = Buffer.from(arrayBuffer).toString('base64');

      // Step 1: Generate site using Gemini API
      const generateResponse = await fetch("/api/generate-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeContent: {
            inlineData: {
              data: base64Resume,
              mimeType: resumeFile.type,
            },
          },
          userPrompt: stylePrompt,
          useQualityModel: useQualityModel, // Pass the model selection
        }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || "Failed to generate portfolio.");
      }

      const { html } = await generateResponse.json();
      setGeneratedHtml(html);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Resume to Portfolio Generator (v2.0)
        </h1>
        <p className="text-lg text-center sm:text-left">
          Upload your resume and describe your desired portfolio style to generate a personalized webpage.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Resume (PDF only)
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2.5"
              required
            />
            {resumeFile && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Selected file: {resumeFile.name}</p>}
          </div>

          <div>
            <label htmlFor="style-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Describe your preferred style/theme
            </label>
            <textarea
              id="style-prompt"
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              placeholder="e.g., 'A minimalist, dark-themed portfolio with subtle animations and a focus on project showcases.'"
              rows={5}
              className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="model-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Model Preference: {useQualityModel ? "Quality (2.5 Flash)" : "Speed (2.0 Flash)"}
            </label>
            <label htmlFor="model-toggle" className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="model-toggle"
                className="sr-only peer"
                checked={useQualityModel}
                onChange={(e) => setUseQualityModel(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading || !resumeFile || !stylePrompt}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {`Generating… This may take a few ${useQualityModel ? "minutes" : "seconds"}.`}
              </>
            ) : (
              "Generate Portfolio"
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md w-full text-center">
            Error: {error}
          </div>
        )}

        {generatedHtml && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Generated Portfolio Preview</h2>
            <div className="border border-gray-300 rounded-md overflow-hidden w-full h-[500px]">
              <iframe
                srcDoc={generatedHtml}
                title="Generated Portfolio Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin" // Basic sandboxing for security
              ></iframe>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  const blob = new Blob([generatedHtml], { type: "text/html" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "portfolio.html";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Download HTML
              </button>
              {/* Deploy to GitHub Pages functionality can be added here */}
              <button
                className="bg-purple-600 text-white p-3 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Deploy to GitHub Pages (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Made with ❤️ by Apoorv • Powered by Next.js
      </footer>
    </div>
  );
}
