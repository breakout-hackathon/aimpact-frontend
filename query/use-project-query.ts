import { useQuery } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { ky } from 'query';

export type Project = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const useProjectsQuery = () => {
  return useQuery<Project[]>({
    initialData: [],
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await ky.get('projects');
      const data = await res.json<Project[]>();

      if (!res.ok) {
        throw new Error('Not found projects');
      }

      return data;
    },
  });
};
