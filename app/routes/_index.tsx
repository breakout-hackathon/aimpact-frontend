'use client';

import { useState, type FormEvent, useRef } from 'react';
import ProjectGrid from '@/components/dashboard/project-grid';
import Navbar from '@/components/dashboard/navbar';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from '@remix-run/react';

import { Button } from '@/components/ui/Button';
import { useProjectsQuery } from 'query/use-project-query';

export default function Home() {
  const navigate = useNavigate();
  const projectsQuery = useProjectsQuery();
  const [promptInput, setPromptInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'my'>('all');

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25 }}
            className="mb-12"
          >
            <div className="w-full">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8 text-center">
                Trending Blockchain Projects
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-4xl mx-auto gap-6 relative">
                <Button
                  variant="secondary"
                  size={"lg"}
                  className="flex items-center gap-1 hover:scale-105 whitespace-nowrap text-lg"
                  onClick={() => navigate('/chat')}
                >
                  <Plus className="w-6 h-6" /> Build a new app
                </Button>
                <div className="absolute right-0 flex items-center">
                  <span className={`mr-3 text-sm font-medium ${filter === 'all' ? 'text-white' : 'text-gray-400'}`}>
                    All Projects
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 ${
                      filter === 'my' ? 'bg-[#9987EE]' : 'bg-gray-600'
                    }`}
                    onClick={() => setFilter(filter === 'all' ? 'my' : 'all')}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        filter === 'my' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`ml-3 text-sm font-medium ${filter === 'my' ? 'text-white' : 'text-gray-400'}`}>
                    My Projects
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          {projectsQuery.isSuccess && <ProjectGrid filter={filter} />}
        </div>
      </section>

      <footer className="bg-black/50 border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">© 2025 Aimpact. All rights reserved.</p>
        </div>
      </footer>
  </main>
  );
}
