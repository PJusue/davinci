"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Eye, EyeOff, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getSettings, saveSettings } from "@/lib/storage";
import { CloudProvider, IaCFormat } from "@/types/infrastructure";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState<CloudProvider>("aws");
  const [defaultFormats, setDefaultFormats] = useState<IaCFormat[]>(["terraform"]);
  const [model, setModel] = useState("claude-3-5-sonnet-20241022");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = getSettings();
    setApiKey(settings.apiKey || "");
    setDefaultProvider(settings.defaultProvider);
    setDefaultFormats(settings.defaultFormats);
    setModel(settings.model || "claude-3-5-sonnet-20241022");
  }, []);

  const handleFormatToggle = (format: IaCFormat) => {
    setDefaultFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleSave = () => {
    saveSettings({
      apiKey,
      defaultProvider,
      defaultFormats,
      model,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6">
          {/* API Configuration */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              API Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Anthropic API Key
                  <a
                    href="https://console.anthropic.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-600 hover:text-primary-700"
                  >
                    <ExternalLink size={14} className="inline" />
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full px-4 py-2 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Claude Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                >
                  <option value="claude-3-5-sonnet-20241022">
                    Claude 3.5 Sonnet (Recommended)
                  </option>
                  <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                  <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Default Preferences */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Default Preferences
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Cloud Provider
                </label>
                <div className="flex gap-2">
                  {(["aws", "azure", "gcp"] as CloudProvider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setDefaultProvider(provider)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        defaultProvider === provider
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {provider.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Output Formats
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "terraform",
                      "cloudformation",
                      "pulumi-python",
                      "pulumi-typescript",
                    ] as IaCFormat[]
                  ).map((format) => (
                    <button
                      key={format}
                      onClick={() => handleFormatToggle(format)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        defaultFormats.includes(format)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {format === "terraform" && "Terraform"}
                      {format === "cloudformation" && "CloudFormation"}
                      {format === "pulumi-python" && "Pulumi (Python)"}
                      {format === "pulumi-typescript" && "Pulumi (TS)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium w-full sm:w-auto justify-center"
            >
              <Save size={20} />
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </div>

          {/* Info Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                IaC Converter uses Claude AI to analyze natural language descriptions and
                architecture diagrams to generate Infrastructure as Code templates.
              </p>
              <p>
                <strong>Supported Cloud Providers:</strong> AWS, Azure, GCP
              </p>
              <p>
                <strong>Supported IaC Formats:</strong> Terraform, CloudFormation, Pulumi (Python &
                TypeScript)
              </p>
              <p className="pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View on GitHub
                  <ExternalLink size={14} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
