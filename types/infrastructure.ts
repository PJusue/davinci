// Cloud Provider Types
export type CloudProvider = "aws" | "azure" | "gcp";

// IaC Format Types
export type IaCFormat = "terraform" | "cloudformation" | "pulumi-python" | "pulumi-typescript";

// Infrastructure Resource Types
export interface InfrastructureResource {
  type: string;
  name: string;
  properties: Record<string, any>;
  dependencies?: string[];
}

// Parsed Infrastructure
export interface ParsedInfrastructure {
  provider: CloudProvider;
  resources: InfrastructureResource[];
  network?: NetworkConfiguration;
  security?: SecurityConfiguration;
}

// Network Configuration
export interface NetworkConfiguration {
  vpcs?: VPCConfig[];
  subnets?: SubnetConfig[];
  securityGroups?: SecurityGroupConfig[];
}

export interface VPCConfig {
  cidr: string;
  name: string;
  enableDnsHostnames?: boolean;
  enableDnsSupport?: boolean;
}

export interface SubnetConfig {
  cidr: string;
  name: string;
  availabilityZone?: string;
  public?: boolean;
}

export interface SecurityGroupConfig {
  name: string;
  description: string;
  ingress?: SecurityRule[];
  egress?: SecurityRule[];
}

export interface SecurityRule {
  protocol: string;
  fromPort: number;
  toPort: number;
  cidr?: string;
  sourceSecurityGroup?: string;
}

// Security Configuration
export interface SecurityConfiguration {
  encryption?: boolean;
  publicAccess?: boolean;
  authentication?: string;
}

// Generated IaC Code
export interface GeneratedIaC {
  format: IaCFormat;
  code: string;
  filename: string;
  resources: string[];
}

// Conversion Request
export interface ConversionRequest {
  input: string;
  inputType: "text" | "image";
  provider: CloudProvider;
  formats: IaCFormat[];
}

// Conversion Response
export interface ConversionResponse {
  success: boolean;
  parsed?: ParsedInfrastructure;
  generated?: GeneratedIaC[];
  error?: string;
  warnings?: string[];
}

// Template
export interface InfrastructureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: CloudProvider;
  prompt: string;
  example?: string;
}

// Conversion History Item
export interface ConversionHistoryItem {
  id: string;
  timestamp: number;
  input: string;
  inputType: "text" | "image";
  provider: CloudProvider;
  formats: IaCFormat[];
  results: GeneratedIaC[];
}

// Settings
export interface AppSettings {
  apiKey?: string;
  defaultProvider: CloudProvider;
  defaultFormats: IaCFormat[];
  theme: "light" | "dark";
  model?: string;
}
