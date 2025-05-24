'use client';

import type { Project } from '@/types/project';
import ProjectCard from '@/components/dashboard/project-card';
import { motion } from 'framer-motion';
import { useProjectsQuery } from 'query/use-project-query';

interface ProjectGridProps {
  projects?: Project[];
  isLoading?: boolean;
  error?: string;
  filter?: 'all' | 'my';
}

const ProjectGrid = ({ filter = 'all' }: ProjectGridProps) => {
  const projectsQuery = useProjectsQuery();

  if (projectsQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-card rounded-xl shadow-lg animate-pulse h-64">
            <div className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-6 w-24 bg-muted rounded"></div>
                    <div className="h-4 w-16 bg-muted rounded mt-2"></div>
                  </div>
                </div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-full bg-muted rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="h-14 bg-muted rounded-lg"></div>
                <div className="h-14 bg-muted rounded-lg"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-6 w-20 bg-muted rounded"></div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projectsQuery.isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center"
      >
        <h3 className="text-lg font-medium text-destructive mb-2">Error Loading Projects</h3>
        <p className="text-muted-foreground">{projectsQuery.error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!projectsQuery.data || projectsQuery.data.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted rounded-lg p-10 text-center">
        <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
        <p className="text-muted-foreground">
          {filter === 'my' 
            ? "You haven't created any projects yet." 
            : 'There are currently no blockchain projects to display.'}
        </p>
      </motion.div>
    );
  }

  // Filter projects based on the selected filter
  const filteredProjects = filter === 'my'
    ? projectsQuery.data.filter(project => {
        // TODO: Replace with actual user address check once authentication is implemented
        // For now, we'll return all projects
        return true;
      })
    : projectsQuery.data;

  if (filter === 'my' && filteredProjects.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-muted rounded-lg p-10 text-center">
        <h3 className="text-lg font-medium mb-2">No Projects Found</h3>
        <p className="text-muted-foreground">You haven't created any projects yet.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Refresh
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectGrid;
