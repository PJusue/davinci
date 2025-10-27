import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IaC Converter - Text & Image to Infrastructure as Code",
  description:
    "Convert natural language and architecture diagrams into production-ready Infrastructure as Code templates for AWS, Azure, and GCP.",
  keywords: [
    "IaC",
    "Infrastructure as Code",
    "Terraform",
    "CloudFormation",
    "Pulumi",
    "AWS",
    "Azure",
    "GCP",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
