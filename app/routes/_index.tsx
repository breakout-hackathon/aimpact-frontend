'use client';

import { useState, useEffect, type FormEvent, useRef, useLayoutEffect } from 'react';
import ProjectGrid from '@/components/dashboard/project-grid';
import Navbar from '@/components/dashboard/navbar';
import type { Project } from '@/types/project';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from '@remix-run/react';

import { Button } from '@/components/ui/Button';
import { mockProjects } from '~/utils/mockProjects';
import { useFetch } from '~/lib/hooks/useFetch';
import { useProjectsQuery } from 'query/use-project-query';

export default function Home() {
  const navigate = useNavigate();
  const projectsQuery = useProjectsQuery();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promptInput, setPromptInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const element = inputRef.current;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    const newHeight = `${element.scrollHeight}px`;
    element.style.height = newHeight;

    setPromptInput(e.currentTarget.value);
  };

  const onSubmitBuildForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!promptInput) {
      navigate('/chat');
      return;
    }

    navigate(`/chat/?prompt=${promptInput}`);
    setPromptInput('');
  };

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
            className="mb-12 text-center flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Trending Blockchain Projects</h2>

            <form
              className="flex items-center gap-2 mb-8 w-full max-w-md mt-6"
              ref={formRef}
              onSubmit={onSubmitBuildForm}
            >
              <div className="flex-1 h-10 relative flex items-center">
                <textarea
                  ref={inputRef}
                  value={promptInput}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      formRef?.current?.submit();
                    }
                  }}
                  onInput={handleInput}
                  rows={1}
                  placeholder="What do you want to build?"
                  className="w-full absolute top-0 right-0 min-h-10 h-10 py-2 px-4 max-h-[260px] resize-none overflow-y-scroll border border-border focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl text-black drop-shadow-lg transition-transform z-100 duration-200 ease-in-out"
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

          {projectsQuery.isSuccess && <ProjectGrid />}
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
