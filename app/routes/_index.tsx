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
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">Trending Blockchain Projects</h2>
            <Button
              variant="secondary"
              className="flex items-center gap-1 hover:scale-105 mx-auto"
              onClick={() => navigate('/chat')}
            >
              <Plus className="w-4 h-4" /> Build a new app
            </Button>
          </motion.div>

          {projectsQuery.isSuccess && <ProjectGrid />}
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
