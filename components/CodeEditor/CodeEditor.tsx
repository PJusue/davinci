"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/app/providers";

interface CodeEditorProps {
  code: string;
  language: string;
}

export default function CodeEditor({ code, language }: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Loading editor...</p>
      </div>
    );
  }

  const editorTheme = theme === "dark" ? "vs-dark" : "vs-light";

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      theme={editorTheme}
      options={{
        readOnly: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        renderWhitespace: "selection",
        automaticLayout: true,
        wordWrap: "on",
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
      }}
      loading={
        <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Loading editor...</p>
        </div>
      }
    />
  );
}
