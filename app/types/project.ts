// Types for the blockchain project showcase application

export interface TokenData {
  symbol: string; // Token symbol/ticker (e.g., "BTC", "ETH")
  name: string; // Full name of the token (e.g., "Bitcoin", "Ethereum")
  marketCap: number; // Market cap in USD
  priceChangePercentage24h: number; // 24h price change as percentage
  currentPrice: number; // Current price in USD
  icon?: string; // URL to token icon image
}

export interface Project {
  id: string; // Unique identifier for the project
  title: string; // Project title
  description: string; // Brief description of the project
  token: TokenData; // Associated token data
  category: ProjectCategory; // Project category
  riskLevel: RiskLevel; // Risk assessment level
  launchDate?: Date; // Optional launch date
  website?: string; // Project website URL
  isHot?: boolean;
}

export type ProjectCategory =
  | 'DeFi' // Decentralized Finance
  | 'NFT' // Non-Fungible Tokens
  | 'GameFi' // Gaming Finance
  | 'Layer1' // Base blockchain platforms
  | 'Layer2' // Scaling solutions
  | 'DAO' // Decentralized Autonomous Organizations
  | 'Privacy' // Privacy-focused projects
  | 'Infrastructure'; // Blockchain infrastructure

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface ApiResponse {
  status: 'success' | 'error';
  data?: Project[];
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
