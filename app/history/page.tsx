"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Calendar, Code } from "lucide-react";
import Link from "next/link";
import { getHistory, clearHistory } from "@/lib/storage";
import { ConversionHistoryItem } from "@/types/infrastructure";

export default function HistoryPage() {
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ConversionHistoryItem | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all conversion history?")) {
      clearHistory();
      setHistory([]);
      setSelectedItem(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Conversion History
              </h1>
            </div>

            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No conversion history yet</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Start Converting
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* History List */}
            <div className="lg:col-span-1 space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? "bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-500"
                      : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-primary-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                    {item.inputType === "text" ? truncateText(item.input) : "Image conversion"}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {item.provider.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded">
                      {item.results.length} format{item.results.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedItem ? (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Conversion Details
                  </h2>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Input
                    </h3>
                    {selectedItem.inputType === "text" ? (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                          {selectedItem.input}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <img
                          src={selectedItem.input}
                          alt="Architecture diagram"
                          className="max-w-full max-h-96 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Generated Files
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.results.map((result, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Code size={18} className="text-primary-600" />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {result.filename}
                            </span>
                          </div>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded">
                            {result.format}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a conversion to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
