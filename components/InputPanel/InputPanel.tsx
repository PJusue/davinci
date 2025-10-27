"use client";

import { useState } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { CloudProvider, IaCFormat } from "@/types/infrastructure";
import { readFileAsDataURL, validateImageFile } from "@/lib/utils";

interface InputPanelProps {
  onConvert: (
    input: string,
    inputType: "text" | "image",
    provider: CloudProvider,
    formats: IaCFormat[]
  ) => void;
  isLoading: boolean;
}

export default function InputPanel({ onConvert, isLoading }: InputPanelProps) {
  const [inputType, setInputType] = useState<"text" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<CloudProvider>("aws");
  const [formats, setFormats] = useState<IaCFormat[]>(["terraform"]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageData(dataUrl);
      setImageFile(file);
    } catch (err) {
      setError("Failed to read image file");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleClearImage = () => {
    setImageData(null);
    setImageFile(null);
    setError(null);
  };

  const handleFormatToggle = (format: IaCFormat) => {
    setFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    );
  };

  const handleConvert = () => {
    setError(null);

    if (inputType === "text") {
      if (!textInput.trim()) {
        setError("Please enter infrastructure description");
        return;
      }
      onConvert(textInput, "text", provider, formats);
    } else {
      if (!imageData) {
        setError("Please upload an architecture diagram");
        return;
      }
      onConvert(imageData, "image", provider, formats);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Input</h2>

        {/* Input Type Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputType("text")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              inputType === "text"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <FileText size={18} />
            Text
          </button>
          <button
            onClick={() => setInputType("image")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              inputType === "image"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <ImageIcon size={18} />
            Image
          </button>
        </div>

        {/* Cloud Provider Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cloud Provider
          </label>
          <div className="flex gap-2">
            {(["aws", "azure", "gcp"] as CloudProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  provider === p
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* IaC Format Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Output Formats
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              ["terraform", "cloudformation", "pulumi-python", "pulumi-typescript"] as IaCFormat[]
            ).map((format) => (
              <button
                key={format}
                onClick={() => handleFormatToggle(format)}
                disabled={format === "cloudformation" && provider !== "aws"}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  formats.includes(format)
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

      {/* Input Area */}
      <div className="flex-1 p-4 overflow-auto">
        {inputType === "text" ? (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your infrastructure in natural language...&#10;&#10;Example:&#10;Create a web application with:&#10;- Load balancer for traffic distribution&#10;- Auto scaling group with 2-4 EC2 instances&#10;- PostgreSQL database with high availability&#10;- VPC with public and private subnets&#10;- Security groups for web and database access"
            className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
        ) : (
          <div className="h-full">
            {imageData ? (
              <div className="relative h-full">
                <img
                  src={imageData}
                  alt="Architecture diagram"
                  className="max-w-full max-h-full object-contain mx-auto"
                />
                <button
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  disabled={isLoading}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-primary-500 transition-colors cursor-pointer"
              >
                <Upload size={48} className="text-gray-400" />
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop an architecture diagram
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">or</p>
                  <label className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                    Supports: JPEG, PNG, GIF, WebP (max 5MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Convert Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleConvert}
          disabled={isLoading || formats.length === 0}
          className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Converting..." : "Convert to IaC"}
        </button>
      </div>
    </div>
  );
}
