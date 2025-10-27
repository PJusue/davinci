"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { GeneratedIaC } from "@/types/infrastructure";
import { downloadFile, copyToClipboard } from "@/lib/utils";
import CodeEditor from "../CodeEditor/CodeEditor";

interface OutputPanelProps {
  results: GeneratedIaC[];
  resources: string[];
}

export default function OutputPanel({ results, resources }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (results[activeTab]) {
      await copyToClipboard(results[activeTab].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (results[activeTab]) {
      downloadFile(results[activeTab].code, results[activeTab].filename);
    }
  };

  const getLanguage = (format: string): string => {
    switch (format) {
      case "terraform":
        return "hcl";
      case "cloudformation":
        return "json";
      case "pulumi-python":
        return "python";
      case "pulumi-typescript":
        return "typescript";
      default:
        return "plaintext";
    }
  };

  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Output</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No output yet</p>
            <p className="text-sm">Convert your infrastructure description to see results</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated IaC</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="Download file"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Format Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === index
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {result.format === "terraform" && "Terraform"}
              {result.format === "cloudformation" && "CloudFormation"}
              {result.format === "pulumi-python" && "Pulumi (Python)"}
              {result.format === "pulumi-typescript" && "Pulumi (TypeScript)"}
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          code={results[activeTab]?.code || ""}
          language={getLanguage(results[activeTab]?.format || "")}
        />
      </div>

      {/* Resource Summary */}
      {resources.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detected Resources ({resources.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {resources.map((resource, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded"
              >
                {resource}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
