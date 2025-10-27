"use client";

import { useState } from "react";
import { Moon, Sun, BookOpen, History, Settings, FileCode } from "lucide-react";
import InputPanel from "@/components/InputPanel/InputPanel";
import OutputPanel from "@/components/OutputPanel/OutputPanel";
import TemplateLibrary from "@/components/TemplateLibrary/TemplateLibrary";
import { useTheme } from "./providers";
import {
  CloudProvider,
  IaCFormat,
  GeneratedIaC,
  InfrastructureTemplate,
} from "@/types/infrastructure";
import { addToHistory } from "@/lib/storage";
import Link from "next/link";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [results, setResults] = useState<GeneratedIaC[]>([]);
  const [resources, setResources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [currentProvider, setCurrentProvider] = useState<CloudProvider>("aws");

  const handleConvert = async (
    input: string,
    inputType: "text" | "image",
    provider: CloudProvider,
    formats: IaCFormat[]
  ) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setResources([]);
    setCurrentInput(input);
    setCurrentProvider(provider);

    try {
      const endpoint = inputType === "text" ? "/api/convert-text" : "/api/convert-image";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input,
          inputType,
          provider,
          formats,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Conversion failed");
        return;
      }

      if (data.generated && data.generated.length > 0) {
        setResults(data.generated);

        // Extract resource names
        const allResources = data.parsed?.resources?.map((r: any) => r.name) || [];
        setResources(allResources);

        // Add to history
        addToHistory({
          input,
          inputType,
          provider,
          formats,
          results: data.generated,
        });
      } else {
        setError("No IaC code was generated");
      }
    } catch (err: any) {
      console.error("Conversion error:", err);
      setError(err.message || "Failed to convert. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: InfrastructureTemplate) => {
    setShowTemplates(false);
    // The template will be populated in the InputPanel
    // We need to trigger a conversion with the template prompt
    handleConvert(template.prompt, "text", template.provider, ["terraform"]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCode size={32} className="text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IaC Converter</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Text & Image to Infrastructure as Code
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Template Library"
              >
                <BookOpen size={20} />
                <span className="hidden sm:inline">Templates</span>
              </button>

              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Conversion History"
              >
                <History size={20} />
                <span className="hidden sm:inline">History</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Settings"
              >
                <Settings size={20} />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Input Panel */}
          <div className="h-full">
            <InputPanel onConvert={handleConvert} isLoading={isLoading} />
          </div>

          {/* Output Panel */}
          <div className="h-full">
            <OutputPanel results={results} resources={resources} />
          </div>
        </div>
      </main>

      {/* Template Library Modal */}
      {showTemplates && (
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplates(false)}
          provider={currentProvider}
        />
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Powered by Claude AI • Supports AWS, Azure, and GCP
          </p>
        </div>
      </footer>
    </div>
  );
}
