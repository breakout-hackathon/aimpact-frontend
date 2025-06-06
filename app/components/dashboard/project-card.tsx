'use client';

import type { Project } from 'query/use-project-query';
import { BadgeCustom, type BadgeCustomProps } from '@/components/ui/badge-custom';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { name, description, category, image, createdAt } = project;

  const getCategoryVariant = (category: string): string => {
    return category.toLowerCase() as any;
  };

  return (
    <div className="group relative bg-black/65 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 z-0 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

      <a className="block p-6 relative z-10 cursor-pointer" href={`/projects/${project.id}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {image && (
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <img src={image} alt={name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-foreground">{name}</h3>
              <div className="flex items-center mt-1">
                {category && (
                  <BadgeCustom variant={getCategoryVariant(category) as BadgeCustomProps['variant']}>
                    {category}
                  </BadgeCustom>
                )}
              </div>
            </div>
          </div>
        </div>

        {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <BadgeCustom variant="secondary">{formatDistanceToNow(createdAt, { addSuffix: true })}</BadgeCustom>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProjectCard;
