'use client';

import { useState, useEffect, type FormEvent } from 'react';
import ProjectGrid from '@/components/dashboard/project-grid';
import Navbar from '@/components/dashboard/navbar';
import type { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from '@remix-run/react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState<string>('');

  const onSubmitBuildForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!promptInput) {
      return;
    }

    navigate(`/chat/?prompt=${promptInput}`);
    setPromptInput('');
  };

  // Simulate API loading
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set the mock projects as if they came from an API
        setProjects(mockProjects);
        setIsLoading(false);
      } catch {
        setError('Failed to load projects. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <Navbar />
      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Trending Blockchain Projects</h2>
            {/* <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Explore these AI-generated blockchain project ideas with potential
              to reshape the digital economy. Each project represents a unique
              vision of how blockchain technology could evolve.
            </p> */}

            <form className="flex items-center gap-2 mb-8 w-full max-w-md mt-6" onSubmit={onSubmitBuildForm}>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={promptInput}
                  onChange={(value) => {
                    setPromptInput(value.target.value);
                  }}
                  placeholder="What do you want to build?"
                  className="w-full py-2 px-4 border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
                />
              </div>
              <Button
                className="px-3 py-2 bg-purple-900 border border-purple-700 text-white rounded-md
              flex items-center gap-1 transition-all duration-300 hover:bg-purple-800 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Build
              </Button>
            </form>
          </motion.div>

          <ProjectGrid projects={projects} isLoading={isLoading} error={error || undefined} />
        </div>
      </section>

      <footer className="bg-black/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-white font-bold text-lg">Aimpact</span>
              </div>
              <p className="text-sm text-gray-400">
                Exploring the future of blockchain technology through AI-generated project ideas.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    About
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to receive updates on new blockchain projects and trends.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-l-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button className="rounded-r-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Aimpact. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Helper function to generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Mock data for blockchain projects
export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'DeFiPulse',
    description: 'Automated liquidity provision and yield farming aggregator with AI-driven strategy optimization',
    token: {
      symbol: 'PULSE',
      name: 'DeFiPulse',
      marketCap: 142000000,
      priceChangePercentage24h: 8.45,
      currentPrice: 3.78,
      icon: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'DeFi',
    riskLevel: 'Medium',
    launchDate: new Date('2023-08-15'),
    website: 'https://defipulse.example.com',
    isHot: true,
  },
  {
    id: generateId(),
    title: 'MetaRealms',
    description: 'Immersive metaverse platform with integrated NFT marketplace and virtual land ownership',
    token: {
      symbol: 'REALM',
      name: 'MetaRealms',
      marketCap: 89000000,
      priceChangePercentage24h: -4.2,
      currentPrice: 1.15,
      icon: 'https://images.pexels.com/photos/2882634/pexels-photo-2882634.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'NFT',
    riskLevel: 'High',
    launchDate: new Date('2023-05-22'),
    website: 'https://metarealms.example.com',
  },
  {
    id: generateId(),
    title: 'CryptoQuest',
    description: 'Play-to-earn RPG with decentralized item ownership and cross-game asset portability',
    token: {
      symbol: 'QUEST',
      name: 'CryptoQuest',
      marketCap: 67500000,
      priceChangePercentage24h: 12.8,
      currentPrice: 0.85,
      icon: 'https://images.pexels.com/photos/1314543/pexels-photo-1314543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'GameFi',
    riskLevel: 'Medium',
    website: 'https://cryptoquest.example.com',
    isHot: true,
  },
  {
    id: generateId(),
    title: 'ZeroChain',
    description: 'High-throughput Layer 1 blockchain with zero-knowledge proof privacy and quantum resistance',
    token: {
      symbol: 'ZERO',
      name: 'ZeroChain',
      marketCap: 325000000,
      priceChangePercentage24h: -1.5,
      currentPrice: 5.32,
      icon: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'Layer1',
    riskLevel: 'Low',
    launchDate: new Date('2022-11-30'),
    website: 'https://zerochain.example.com',
  },
  {
    id: generateId(),
    title: 'DataDAO',
    description: 'Decentralized governance platform for managing and monetizing shared data assets',
    token: {
      symbol: 'DATA',
      name: 'DataDAO',
      marketCap: 45000000,
      priceChangePercentage24h: 6.7,
      currentPrice: 0.42,
      icon: 'https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'DAO',
    riskLevel: 'High',
    website: 'https://datadao.example.com',
  },
  {
    id: generateId(),
    title: 'ScaleSphere',
    description: 'Layer 2 scaling solution with ZK-rollup technology for Ethereum applications',
    token: {
      symbol: 'SCALE',
      name: 'ScaleSphere',
      marketCap: 178000000,
      priceChangePercentage24h: 3.2,
      currentPrice: 2.15,
      icon: 'https://images.pexels.com/photos/8451490/pexels-photo-8451490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'Layer2',
    riskLevel: 'Medium',
    launchDate: new Date('2023-02-10'),
    website: 'https://scalesphere.example.com',
  },
  {
    id: generateId(),
    title: 'PrivacyShield',
    description: 'Privacy-focused cross-chain bridge with confidential transaction capabilities',
    token: {
      symbol: 'SHIELD',
      name: 'PrivacyShield',
      marketCap: 92000000,
      priceChangePercentage24h: -2.8,
      currentPrice: 1.65,
      icon: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'Privacy',
    riskLevel: 'High',
    website: 'https://privacyshield.example.com',
  },
  {
    id: generateId(),
    title: 'ChainOracle',
    description: 'Decentralized oracle network for secure real-world data feeds with cryptographic verification',
    token: {
      symbol: 'ORACLE',
      name: 'ChainOracle',
      marketCap: 215000000,
      priceChangePercentage24h: 5.4,
      currentPrice: 4.27,
      icon: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'Infrastructure',
    riskLevel: 'Low',
    launchDate: new Date('2022-09-05'),
    website: 'https://chainoracle.example.com',
    isHot: true,
  },
  {
    id: generateId(),
    title: 'TokenVerse',
    description: 'Social token platform enabling creators to launch personalized economies',
    token: {
      symbol: 'VERSE',
      name: 'TokenVerse',
      marketCap: 53000000,
      priceChangePercentage24h: -6.2,
      currentPrice: 0.75,
      icon: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    category: 'DeFi',
    riskLevel: 'Extreme',
    website: 'https://tokenverse.example.com',
  },
];
